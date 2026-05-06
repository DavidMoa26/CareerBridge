"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormDescription,
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
import { locationRequirements, wageIntervals } from "@/drizzle/schema"
import {
  formatLocationRequirement,
  formatWageInterval,
} from "../../lib/formatters"
import { z } from "zod"
import { jobListingSchema } from "../../actions/schemas"

export function Step2CompensationLocation() {
  const form = useFormContext<z.infer<typeof jobListingSchema>>()
  const isRemote = form.watch("locationRequirement") === "remote"

  return (
    <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start @container">
      <FormField
        name="wage"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Wage</FormLabel>
            <div className="flex">
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  value={field.value ?? ""}
                  className="rounded-r-none"
                  onChange={e =>
                    field.onChange(
                      isNaN(e.target.valueAsNumber)
                        ? null
                        : e.target.valueAsNumber
                    )
                  }
                />
              </FormControl>
              <FormField
                name="wageInterval"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={val => field.onChange(val ?? null)}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-l-none">
                          / <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wageIntervals.map(interval => (
                          <SelectItem key={interval} value={interval}>
                            {formatWageInterval(interval)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>Optional</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="locationRequirement"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Requirement</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
      {!isRemote && (
        <>
          <FormField
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="e.g. Tel Aviv"
                    className="rounded-xl border-slate-200 focus-visible:ring-slate-300"
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
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="e.g. Israel"
                    className="rounded-xl border-slate-200 focus-visible:ring-slate-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  )
}
