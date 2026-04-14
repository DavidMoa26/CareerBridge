import { Skeleton } from "@/components/ui/skeleton"

function SingleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-cb-md p-6 space-y-4">
      {/* Header row */}
      <div className="flex items-start gap-4">
        <Skeleton className="size-14 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-5 w-3/5 rounded-lg" />
          <Skeleton className="h-4 w-2/5 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-16 rounded-lg shrink-0" />
      </div>
      {/* Badge row */}
      <div className="flex flex-wrap gap-2 pt-1">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function JobListingCardSkeleton() {
  return (
    <div className="space-y-4">
      <SingleCardSkeleton />
      <SingleCardSkeleton />
      <SingleCardSkeleton />
    </div>
  )
}
