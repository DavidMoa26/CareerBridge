import { Badge } from "@/components/ui/badge"
import { JobListingTable } from "@/drizzle/schema"
import { cn } from "@/lib/utils"
import { ComponentProps } from "react"
import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirement,
  formatWage,
} from "../lib/formatters"
import {
  BanknoteIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  MapPinIcon,
  SparklesIcon,
  TimerIcon,
} from "lucide-react"

export function JobListingBadges({
  jobListing: {
    wage,
    wageInterval,
    country,
    city,
    type,
    experienceLevel,
    locationRequirement,
    isFeatured,
  },
  className,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "wage"
    | "wageInterval"
    | "country"
    | "city"
    | "type"
    | "experienceLevel"
    | "locationRequirement"
    | "isFeatured"
  >
  className?: string
}) {
  // Base style shared by all non-featured badges
  const pillProps = {
    variant: "outline",
    size: "sm",
    className: cn(
      "rounded-full border-slate-200 bg-slate-50 text-slate-600 font-medium",
      className
    ),
  } satisfies ComponentProps<typeof Badge>

  return (
    <>
      {/* Featured — violet accent, sparkle icon */}
      {isFeatured && (
        <Badge
          size="sm"
          className={cn(
            "rounded-full border-violet-200 bg-violet-100 text-violet-700 font-semibold",
            className
          )}
        >
          <SparklesIcon className="size-3 mr-0.5" />
          Featured
        </Badge>
      )}

      {/* Salary */}
      {wage != null && wageInterval != null && (
        <Badge {...pillProps}>
          <BanknoteIcon className="size-3" />
          {formatWage(wage, wageInterval)}
        </Badge>
      )}

      {/* Location */}
      {(country != null || city != null) && (
        <Badge {...pillProps}>
          <MapPinIcon className="size-3" />
          {formatJobListingLocation({ country, city })}
        </Badge>
      )}

      {/* Remote / On-site */}
      <Badge {...pillProps}>
        <BriefcaseIcon className="size-3" />
        {formatLocationRequirement(locationRequirement)}
      </Badge>

      {/* Job type */}
      <Badge {...pillProps}>
        <TimerIcon className="size-3" />
        {formatJobType(type)}
      </Badge>

      {/* Experience */}
      <Badge {...pillProps}>
        <GraduationCapIcon className="size-3" />
        {formatExperienceLevel(experienceLevel)}
      </Badge>
    </>
  )
}
