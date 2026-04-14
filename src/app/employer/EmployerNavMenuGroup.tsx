"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { JobListingStatus, JobListingTable } from "@/drizzle/schema"
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

type JobListingNavItem = Pick<
  typeof JobListingTable.$inferSelect,
  "title" | "id"
> & { applicationCount: number }

export function EmployerNavMenuGroup({
  status,
  jobListings,
}: {
  status: JobListingStatus
  jobListings: JobListingNavItem[]
}) {
  const { jobListingId } = useParams()

  return (
    <SidebarMenu>
      <Collapsible
        defaultOpen={
          status !== "delisted" ||
          jobListings.find(job => job.id === jobListingId) != null
        }
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="text-cb-slate-600 hover:bg-cb-slate-100 hover:text-cb-slate-900 rounded-lg font-medium text-xs uppercase tracking-wide transition-colors duration-150">
              {formatJobListingStatus(status)}
              <ChevronRightIcon className="ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {jobListings.map(jobListing => (
                <EmployerNavJobListingItem
                  key={jobListing.id}
                  {...jobListing}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  )
}

function EmployerNavJobListingItem({
  id,
  title,
  applicationCount,
}: JobListingNavItem) {
  const { jobListingId } = useParams()
  const isActive = jobListingId === id

  return (
    <SidebarMenuSubItem className="relative">
      <SidebarMenuSubButton
        isActive={isActive}
        asChild
        className={
          isActive
            ? "bg-cb-blue-50 text-cb-blue-600 font-medium rounded-md pr-8"
            : "text-cb-slate-700 hover:bg-cb-slate-100 hover:text-cb-slate-900 rounded-md transition-colors duration-150 pr-8"
        }
      >
        <Link href={`/employer/job-listings/${id}`}>
          <span className="truncate">{title}</span>
        </Link>
      </SidebarMenuSubButton>
      {applicationCount > 0 && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-cb-blue-600 bg-cb-blue-100 rounded-full px-1.5 py-0.5 leading-none">
          {applicationCount}
        </span>
      )}
    </SidebarMenuSubItem>
  )
}
