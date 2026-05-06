"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/LoadingSwap"
import { z } from "zod"
import { jobListingSchema } from "../../actions/schemas"

interface Step3DescriptionProps {
  isEditing: boolean
  isSubmitting: boolean
}

export function Step3Description({
  isEditing,
  isSubmitting,
}: Step3DescriptionProps) {
  const form = useFormContext<z.infer<typeof jobListingSchema>>()

  return (
    <div className="space-y-6">
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <MarkdownEditor {...field} markdown={field.value} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        disabled={isSubmitting}
        type="submit"
        className="w-full"
      >
        <LoadingSwap isLoading={isSubmitting}>
          {isEditing ? "Update Job Listing" : "Create Job Listing"}
        </LoadingSwap>
      </Button>
    </div>
  )
}
