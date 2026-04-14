import { JobListingItems } from "./_shared/JobListingItems"

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>
}) {
  return (
    <div className="px-6 py-6 max-w-3xl">
      {/* Section heading */}
      <div className="mb-6">
        <h1 className="text-slate-900 font-semibold text-2xl tracking-tight">
          Open Positions
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Discover opportunities that match your skills and goals.
        </p>
      </div>

      <JobListingItems searchParams={searchParams} />
    </div>
  )
}
