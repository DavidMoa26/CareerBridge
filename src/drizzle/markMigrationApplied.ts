/**
 * One-shot bootstrap script: marks migration 0000 as already applied in the
 * Drizzle migrations tracking table so that `db:migrate` only runs 0001+.
 *
 * Run with: npx tsx src/drizzle/markMigrationApplied.ts
 */
import "dotenv/config"
import { sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool)

async function main() {
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS drizzle`)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `)

  const existing = await db.execute(
    sql`SELECT hash FROM drizzle.__drizzle_migrations WHERE hash = '0000_moaning_human_robot'`
  )

  if (existing.rows.length === 0) {
    await db.execute(
      sql`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ('0000_moaning_human_robot', ${Date.now()})`
    )
    console.log("✓ Marked 0000_moaning_human_robot as applied")
  } else {
    console.log("Migration 0000 was already marked as applied — nothing to do")
  }

  await pool.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
