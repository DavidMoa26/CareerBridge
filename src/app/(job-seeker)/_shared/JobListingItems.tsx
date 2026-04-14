import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { db } from "@/drizzle/db"
import {
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  OrganizationTable,
} from "@/drizzle/schema"
import { convertSearchParamsToString } from "@/lib/convertSearchParamsToString"
import { cn } from "@/lib/utils"
import { and, desc, eq, ilike, or, SQL } from "drizzle-orm"
import { Suspense } from "react"
import { differenceInDays } from "date-fns"
import { connection } from "next/server"
import { Badge } from "@/components/ui/badge"
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges"
import { z } from "zod"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { getJobListingGlobalTag } from "@/features/jobListings/db/cache/jobListings"
import { getOrganizationIdTag } from "@/features/organizations/db/cache/organizations"
import { AnimatedJobCard } from "./AnimatedJobCard"
import { AnimatedJobListingGrid, AnimatedJobListingItem } from "./AnimatedJobListingGrid"
import { JobListingCardSkeleton } from "./JobListingCardSkeleton"
import { BriefcaseIcon } from "lucide-react"

type Props = {
  searchParams: Promise<Record<string, string | string[]>>
  params?: Promise<{ jobListingId: string }>
}

const searchParamsSchema = z.object({
  title: z.string().optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  country: z.string().optional().catch(undefined),
  experience: z.enum(experienceLevels).optional().catch(undefined),
  locationRequirement: z.enum(locationRequirements).optional().catch(undefined),
  type: z.enum(jobListingTypes).optional().catch(undefined),
  jobIds: z
    .union([z.string(), z.array(z.string())])
    .transform(v => (Array.isArray(v) ? v : [v]))
    .optional()
    .catch([]),
})

export function JobListingItems(props: Props) {
  return (
    <Suspense fallback={<JobListingCardSkeleton />}>
      <SuspendedComponent {...props} />
    </Suspense>
  )
}

async function SuspendedComponent({ searchParams, params }: Props) {
  const jobListingId = params ? (await params).jobListingId : undefined
  const { success, data } = searchParamsSchema.safeParse(await searchParams)
  const search = success ? data : {}

  const jobListings = await getJobListings(search, jobListingId)

  if (jobListings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <BriefcaseIcon className="size-7 text-slate-400" />
        </div>
        <p className="text-slate-700 font-semibold text-lg">No listings found</p>
        <p className="text-slate-400 text-sm mt-1 max-w-xs">
          Try adjusting your filters or check back later for new opportunities.
        </p>
      </div>
    )
  }

  return (
    <AnimatedJobListingGrid>
      {jobListings.map(jobListing => (
        <AnimatedJobListingItem key={jobListing.id}>
          <AnimatedJobCard
            href={`/job-listings/${jobListing.id}?${convertSearchParamsToString(search)}`}
          >
            <JobListingCard
              jobListing={jobListing}
              organization={jobListing.organization}
            />
          </AnimatedJobCard>
        </AnimatedJobListingItem>
      ))}
    </AnimatedJobListingGrid>
  )
}

function JobListingCard({
  jobListing,
  organization,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "title"
    | "country"
    | "city"
    | "wage"
    | "wageInterval"
    | "experienceLevel"
    | "type"
    | "postedAt"
    | "locationRequirement"
    | "isFeatured"
  >
  organization: Pick<typeof OrganizationTable.$inferSelect, "name" | "imageUrl">
}) {
  const nameInitials = organization?.name
    .split(" ")
    .slice(0, 4)
    .map(word => word[0])
    .join("")

  return (
    <div
      className={cn(
        "@container bg-white rounded-2xl shadow-cb-md border-0 p-6 transition-all duration-200",
        jobListing.isFeatured &&
          "ring-2 ring-violet-200 bg-gradient-to-br from-white to-violet-50/40"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        {/* Company avatar */}
        <Avatar className="size-12 rounded-xl shrink-0 @max-sm:hidden">
          <AvatarImage
            src={organization.imageUrl ?? undefined}
            alt={organization.name}
          />
          <AvatarFallback className="rounded-xl text-sm font-bold bg-gradient-to-br from-blue-600 to-blue-700 text-white uppercase">
            {nameInitials}
          </AvatarFallback>
        </Avatar>

        {/* Title + company */}
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-900 font-semibold text-base leading-snug mb-0.5 truncate">
            {jobListing.title}
          </h3>
          <p className="text-slate-500 text-sm truncate">{organization.name}</p>
          {/* Posted date — visible only on small containers */}
          {jobListing.postedAt != null && (
            <div className="text-xs font-medium text-blue-600 mt-1 @min-md:hidden">
              <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                <DaysSincePosting postedAt={jobListing.postedAt} />
              </Suspense>
            </div>
          )}
        </div>

        {/* Posted date — visible on wider containers */}
        {jobListing.postedAt != null && (
          <div className="text-xs font-medium text-blue-600 shrink-0 @max-md:hidden">
            <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
              <DaysSincePosting postedAt={jobListing.postedAt} />
            </Suspense>
          </div>
        )}
      </div>

      {/* Badge row */}
      <div className="flex flex-wrap gap-1.5">
        <JobListingBadges
          jobListing={jobListing}
          className={jobListing.isFeatured ? "border-violet-200" : undefined}
        />
      </div>
    </div>
  )
}

async function DaysSincePosting({ postedAt }: { postedAt: Date }) {
  await connection()
  const daysSincePosted = differenceInDays(postedAt, Date.now())

  if (daysSincePosted === 0) {
    return (
      <Badge
        size="sm"
        className="bg-blue-600 text-white border-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      >
        New
      </Badge>
    )
  }

  return new Intl.RelativeTimeFormat(undefined, {
    style: "narrow",
    numeric: "always",
  }).format(daysSincePosted, "days")
}

async function getJobListings(
  searchParams: z.infer<typeof searchParamsSchema>,
  jobListingId: string | undefined
) {
  "use cache"
  cacheTag(getJobListingGlobalTag())

  const whereConditions: (SQL | undefined)[] = []
  if (searchParams.title) {
    whereConditions.push(
      ilike(JobListingTable.title, `%${searchParams.title}%`)
    )
  }
  if (searchParams.locationRequirement) {
    whereConditions.push(
      eq(JobListingTable.locationRequirement, searchParams.locationRequirement)
    )
  }
  if (searchParams.city) {
    whereConditions.push(ilike(JobListingTable.city, `%${searchParams.city}%`))
  }
  if (searchParams.country) {
    whereConditions.push(
      ilike(JobListingTable.country, `%${searchParams.country}%`)
    )
  }
  if (searchParams.experience) {
    whereConditions.push(
      eq(JobListingTable.experienceLevel, searchParams.experience)
    )
  }
  if (searchParams.type) {
    whereConditions.push(eq(JobListingTable.type, searchParams.type))
  }
  if (searchParams.jobIds) {
    whereConditions.push(
      or(...searchParams.jobIds.map(jobId => eq(JobListingTable.id, jobId)))
    )
  }

  const data = await db.query.JobListingTable.findMany({
    where: or(
      jobListingId
        ? and(
            eq(JobListingTable.status, "published"),
            eq(JobListingTable.id, jobListingId)
          )
        : undefined,
      and(eq(JobListingTable.status, "published"), ...whereConditions)
    ),
    with: {
      organization: {
        columns: { id: true, name: true, imageUrl: true },
      },
    },
    orderBy: [desc(JobListingTable.isFeatured), desc(JobListingTable.postedAt)],
  })

  data.forEach(listing => {
    cacheTag(getOrganizationIdTag(listing.organization.id))
  })

  return data
}
