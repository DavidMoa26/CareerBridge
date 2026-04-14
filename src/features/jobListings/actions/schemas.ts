import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema"
import { z } from "zod"

export const jobListingSchema = z
  .object({
    title: z.string().min(3, "Must be at least 3 characters").max(100, "Must be 100 characters or less"),
    description: z.string().min(1, "Required").max(5000, "Must be 5000 characters or less"),
    experienceLevel: z.enum(experienceLevels),
    locationRequirement: z.enum(locationRequirements),
    type: z.enum(jobListingTypes),
    wage: z.number().int().positive().min(1).nullable(),
    wageInterval: z.enum(wageIntervals).nullable(),
    country: z
      .string()
      .transform(val => (val.trim() === "" ? null : val))
      .nullable(),
    city: z
      .string()
      .transform(val => (val.trim() === "" ? null : val))
      .nullable(),
  })
  .refine(
    listing => {
      return (listing.wage == null) === (listing.wageInterval == null)
    },
    {
      message: "Wage and wage interval must both be set or both be empty",
      path: ["wage"],
    }
  )
  .refine(
    listing => {
      return listing.locationRequirement === "remote" || listing.city != null
    },
    {
      message: "Required for non-remote listings",
      path: ["city"],
    }
  )
  .refine(
    listing => {
      return (
        listing.locationRequirement === "remote" || listing.country != null
      )
    },
    {
      message: "Required for non-remote listings",
      path: ["country"],
    }
  )

export const jobListingAiSearchSchema = z.object({
  query: z.string().min(1, "Required"),
})
