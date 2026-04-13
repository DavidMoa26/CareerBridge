import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth"
import { getJobListingOrganizationTag } from "../db/cache/jobListings"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { db } from "@/drizzle/db"
import { JobListingTable } from "@/drizzle/schema"
import { and, count, eq } from "drizzle-orm"
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures"

export async function hasReachedMaxPublishedJobListings() {
  return false
}

export async function hasReachedMaxFeaturedJobListings() {
  return false
}

async function getPublishedJobListingsCount(orgId: string) {
  "use cache"
  cacheTag(getJobListingOrganizationTag(orgId))

  const [res] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.status, "published")
      )
    )
  return res?.count ?? 0
}

async function getFeaturedJobListingsCount(orgId: string) {
  "use cache"
  cacheTag(getJobListingOrganizationTag(orgId))

  const [res] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.isFeatured, true)
      )
    )
  return res?.count ?? 0
}
