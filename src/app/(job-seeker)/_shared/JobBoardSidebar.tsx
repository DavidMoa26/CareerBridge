import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { JobListingFilterForm } from "@/features/jobListings/components/JobListingFilterForm"
import { SlidersHorizontalIcon } from "lucide-react"
import { Suspense } from "react"

export function JobBoardSidebar() {
  return (
    <SidebarGroup className="group-data-[state=collapsed]:hidden">
      {/* Panel header */}
      <div className="px-1 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <SlidersHorizontalIcon className="size-3.5 text-slate-400" />
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
            Filters
          </span>
        </div>
        <div className="h-px bg-slate-800" />
      </div>

      <SidebarGroupContent className="px-1">
        <Suspense
          fallback={
            <div className="space-y-4 px-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 rounded-md bg-slate-800 animate-pulse" />
                  <div className="h-9 w-full rounded-xl bg-slate-800 animate-pulse" />
                </div>
              ))}
            </div>
          }
        >
          <JobListingFilterForm />
        </Suspense>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
