"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ExperienceLevel,
  experienceLevels,
  JobListingType,
  jobListingTypes,
  LocationRequirement,
  locationRequirements,
} from "@/drizzle/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirement,
} from "../lib/formatters"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/LoadingSwap"
import { useSidebar } from "@/components/ui/sidebar"
import { SlidersHorizontalIcon } from "lucide-react"

const ANY_VALUE = "any"

const jobListingFilterSchema = z.object({
  title: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  experienceLevel: z.enum(experienceLevels).or(z.literal(ANY_VALUE)).optional(),
  type: z.enum(jobListingTypes).or(z.literal(ANY_VALUE)).optional(),
  locationRequirement: z
    .enum(locationRequirements)
    .or(z.literal(ANY_VALUE))
    .optional(),
})

export function JobListingFilterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const form = useForm({
    resolver: zodResolver(jobListingFilterSchema),
    defaultValues: {
      title: searchParams.get("title") ?? "",
      city: searchParams.get("city") ?? "",
      locationRequirement:
        (searchParams.get("locationRequirement") as LocationRequirement) ??
        ANY_VALUE,
      country: searchParams.get("country") ?? "",
      experienceLevel:
        (searchParams.get("experience") as ExperienceLevel) ?? ANY_VALUE,
      type: (searchParams.get("type") as JobListingType) ?? ANY_VALUE,
    },
  })

  function onSubmit(data: z.infer<typeof jobListingFilterSchema>) {
    const newParams = new URLSearchParams()
    if (data.city) newParams.set("city", data.city)
    if (data.country) newParams.set("country", data.country)
    if (data.title) newParams.set("title", data.title)
    if (data.experienceLevel && data.experienceLevel !== ANY_VALUE)
      newParams.set("experience", data.experienceLevel)
    if (data.type && data.type !== ANY_VALUE) newParams.set("type", data.type)
    if (data.locationRequirement && data.locationRequirement !== ANY_VALUE)
      newParams.set("locationRequirement", data.locationRequirement)

    router.push(`${pathname}?${newParams.toString()}`)
    setOpenMobile(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-1">
        {/* ── Text Filters ─────────────────────────────────────────── */}
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wide">
                Job Title
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Software Engineer"
                  className="focus-gradient bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-xl h-9 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Divider ──────────────────────────────────────────────── */}
        <div className="h-px bg-slate-800" />

        {/* ── Select Filters ───────────────────────────────────────── */}
        <FormField
          name="locationRequirement"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wide">
                Work Style
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full bg-slate-800/60 border-slate-700 text-slate-200 rounded-xl h-9 text-sm">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>Any</SelectItem>
                  {locationRequirements.map(lr => (
                    <SelectItem key={lr} value={lr}>
                      {formatLocationRequirement(lr)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wide">
                City
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. New York"
                  className="focus-gradient bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-xl h-9 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="country"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wide">
                Country
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Israel"
                  className="focus-gradient bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-500 rounded-xl h-9 text-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wide">
                Job Type
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full bg-slate-800/60 border-slate-700 text-slate-200 rounded-xl h-9 text-sm">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>Any</SelectItem>
                  {jobListingTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {formatJobType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="experienceLevel"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300 text-xs font-medium uppercase tracking-wide">
                Experience
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full bg-slate-800/60 border-slate-700 text-slate-200 rounded-xl h-9 text-sm">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>Any</SelectItem>
                  {experienceLevels.map(experience => (
                    <SelectItem key={experience} value={experience}>
                      {formatExperienceLevel(experience)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ── Submit ───────────────────────────────────────────────── */}
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-9 font-medium text-sm transition-colors duration-150 mt-1"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            <span className="flex items-center gap-2">
              <SlidersHorizontalIcon className="size-3.5" />
              Apply Filters
            </span>
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}
