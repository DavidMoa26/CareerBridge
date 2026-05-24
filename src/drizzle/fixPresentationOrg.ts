/**
 * One-off fix: migrates all org_pres_ job listings and settings to the real Clerk org.
 *
 * Usage:
 *   npm run db:fix:presentation
 *
 * What it does:
 *   1. Finds the real Clerk org (id does NOT start with org_seed_ or org_pres_)
 *   2. Moves all job_listings from org_pres_* to the real org
 *   3. Moves the organization_user_settings row
 *   4. Deletes the now-empty org_pres_ records
 */

import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set.');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function fix(): Promise<void> {
  console.log('--- fixPresentationOrg ---');

  try {
    // 1. Find the real Clerk org
    const realOrgResult = await pool.query<{ id: string; name: string }>(
      `SELECT id, name FROM organizations
       WHERE id NOT LIKE 'org_seed_%'
         AND id NOT LIKE 'org_pres_%'
       ORDER BY "createdAt" DESC
       LIMIT 1`
    );

    if (realOrgResult.rowCount === 0) {
      console.error('ERROR: No real Clerk organization found in the DB.');
      console.error('Make sure you have created an organization via the app and that Inngest processed the webhook.');
      process.exit(1);
    }

    const realOrg = realOrgResult.rows[0];
    console.log(`✓ Real org found: "${realOrg.name}" (${realOrg.id})`);

    // 2. Find the pres org(s) to migrate from
    const presOrgResult = await pool.query<{ id: string }>(
      `SELECT id FROM organizations WHERE id LIKE 'org_pres_%'`
    );

    if (presOrgResult.rowCount === 0) {
      console.log('No org_pres_ organizations found — nothing to migrate.');
      process.exit(0);
    }

    const presOrgIds = presOrgResult.rows.map(r => r.id);
    console.log(`  Found ${presOrgIds.length} org_pres_ org(s): ${presOrgIds.join(', ')}`);

    for (const presOrgId of presOrgIds) {
      // 3. Move job listings
      const listingsResult = await pool.query(
        `UPDATE job_listings
         SET "organizationId" = $1, "updatedAt" = NOW()
         WHERE "organizationId" = $2`,
        [realOrg.id, presOrgId]
      );
      console.log(`✓ Moved ${listingsResult.rowCount} job listings → "${realOrg.name}"`);

      // 4. Upsert organization_user_settings for the real org
      //    (copy from pres org, then delete the pres row)
      const settingsResult = await pool.query<{
        userId: string;
        newApplicationEmailNotifications: boolean;
        minimumRating: number | null;
      }>(
        `SELECT "userId", "newApplicationEmailNotifications", "minimumRating"
         FROM organization_user_settings
         WHERE "organizationId" = $1`,
        [presOrgId]
      );

      for (const s of settingsResult.rows) {
        await pool.query(
          `INSERT INTO organization_user_settings
             ("userId", "organizationId", "newApplicationEmailNotifications", "minimumRating", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, NOW(), NOW())
           ON CONFLICT ("userId", "organizationId") DO UPDATE
             SET "newApplicationEmailNotifications" = EXCLUDED."newApplicationEmailNotifications",
                 "minimumRating" = EXCLUDED."minimumRating",
                 "updatedAt" = NOW()`,
          [s.userId, realOrg.id, s.newApplicationEmailNotifications, s.minimumRating]
        );
        console.log(`✓ Upserted organization_user_settings for user ${s.userId} → "${realOrg.name}" (email notifications: ${s.newApplicationEmailNotifications})`);
      }

      // 5. Clean up pres org records
      await pool.query(
        `DELETE FROM organization_user_settings WHERE "organizationId" = $1`,
        [presOrgId]
      );
      await pool.query(
        `DELETE FROM organizations WHERE id = $1`,
        [presOrgId]
      );
      console.log(`✓ Cleaned up org_pres_ record (${presOrgId})`);
    }

    console.log();
    console.log('Migration complete! All listings are now under your real Clerk organization.');
    console.log('Run `npm run db:studio` to verify, or refresh the employer dashboard.');
  } catch (err) {
    console.error('Fix failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fix();
