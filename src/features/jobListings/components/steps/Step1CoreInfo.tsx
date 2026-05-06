"use client"

import { useFormContext } from "react-hook-form"
import {
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
import { experienceLevels, jobListingTypes } from "@/drizzle/schema"
import {
  formatExperienceLevel,
  formatJobType,
} from "../../lib/formatters"
import { z } from "zod"
import { jobListingSchema } from "../../actions/schemas"

export function Step1CoreInfo() {
  const form = useFormContext<z.infer<typeof jobListingSchema>>()

  return (
    <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start @container">
      <FormField
        name="title"
        control={form.control}
        render={({ field }) => (
          <FormItem className="@md:col-span-2">
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input {...field} />
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
            <FormLabel>Job Type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
            <FormLabel>Experience Level</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
    </div>
  )
}
