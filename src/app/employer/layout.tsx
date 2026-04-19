import { PlatformSidebar } from "@/components/sidebar/PlatformSidebar"
import { NavMenuSection } from "@/components/sidebar/NavMenuSection"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { db } from "@/drizzle/db"
import {
  JobListingApplicationTable,
  JobListingStatus,
  JobListingTable,
} from "@/drizzle/schema"
import { getJobListingApplicationJobListingTag } from "@/features/jobListingApplications/db/cache/jobListingApplications"
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings"
import { sortJobListingsByStatus } from "@/features/jobListings/lib/utils"
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationButton"
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth"
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions"
import { count, desc, eq } from "drizzle-orm"
import { ClipboardListIcon, PlusIcon } from "lucide-react"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ReactNode, Suspense } from "react"
import { EmployerNavMenuGroup } from "./EmployerNavMenuGroup"

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  )
}

async function LayoutSuspense({ children }: { children: ReactNode }) {
  const { orgId } = await getCurrentOrganization()
  if (orgId == null) return redirect("/organizations/select")

  const canCreateListings = await hasOrgUserPermission(
    "org:job_listings:create"
  )

  return (
    <PlatformSidebar
      content={
        <>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-cb-slate-500 px-2 mb-1">
              Job Listings
            </SidebarGroupLabel>
            {canCreateListings && (
              <SidebarGroupAction
                title="Add Job Listing"
                asChild
                className="text-cb-slate-500 hover:text-cb-blue-600 hover:bg-cb-blue-50 rounded-md transition-colors duration-150"
              >
                <Link href="/employer/job-listings/new">
                  <PlusIcon className="size-4" />
                  <span className="sr-only">Add Job Listing</span>
                </Link>
              </SidebarGroupAction>
            )}
            <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
              <Suspense>
                <JobListingMenu orgId={orgId} />
              </Suspense>
            </SidebarGroupContent>
          </SidebarGroup>
          <NavMenuSection
            className="mt-auto"
            items={[
              { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
            ]}
          />
        </>
      }
      footerButton={<SidebarOrganizationButton />}
    >
      {children}
    </PlatformSidebar>
  )
}

async function JobListingMenu({ orgId }: { orgId: string }) {
  const jobListings = await getJobListings(orgId)

  if (
    jobListings.length === 0 &&
    (await hasOrgUserPermission("org:job_listings:create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="text-cb-blue-600 hover:bg-cb-blue-50 rounded-lg transition-colors duration-150"
          >
            <Link href="/employer/job-listings/new">
              <PlusIcon className="size-4" />
              <span>Create your first job listing</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const grouped = jobListings.reduce(
    (acc, j) => {
      acc[j.status] = acc[j.status] ?? []
      acc[j.status].push(j)
      return acc
    },
    {} as Record<string, typeof jobListings>
  )

  return Object.entries(grouped)
    .sort(([a], [b]) => {
      return sortJobListingsByStatus(
        a as JobListingStatus,
        b as JobListingStatus
      )
    })
    .map(([status, jobListings]) => (
      <EmployerNavMenuGroup
        key={status}
        status={status as JobListingStatus}
        jobListings={jobListings}
      />
    ))
}

async function getJobListings(orgId: string) {
  "use cache"
  cacheTag(getJobListingOrganizationTag(orgId))

  const data = await db
    .select({
      id: JobListingTable.id,
      title: JobListingTable.title,
      status: JobListingTable.status,
      applicationCount: count(JobListingApplicationTable.userId),
    })
    .from(JobListingTable)
    .where(eq(JobListingTable.organizationId, orgId))
    .leftJoin(
      JobListingApplicationTable,
      eq(JobListingTable.id, JobListingApplicationTable.jobListingId)
    )
    .groupBy(JobListingApplicationTable.jobListingId, JobListingTable.id)
    .orderBy(desc(JobListingTable.createdAt))

  data.forEach(jobListing => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id))
  })

  return data
}
