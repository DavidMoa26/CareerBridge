"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor"
import { LoadingSwap } from "@/components/LoadingSwap"
import { z } from "zod"
import { toast } from "sonner"
import { createJobListingApplication } from "../actions/actions"
import { newJobListingApplicationSchema } from "../actions/schemas"
import { Button } from "@/components/ui/button"

export function NewJobListingApplicationForm({
  jobListingId,
  resumeFileUrl,
  resumeFileKey,
}: {
  jobListingId: string
  resumeFileUrl: string
  resumeFileKey: string
}) {
  const form = useForm({
    resolver: zodResolver(newJobListingApplicationSchema),
    defaultValues: { coverLetter: "" },
  })

  async function onSubmit(
    data: z.infer<typeof newJobListingApplicationSchema>
  ) {
    const results = await createJobListingApplication(jobListingId, data)

    if (results.error) {
      toast.error(results.message)
      return
    }

    toast.success(results.message)
  }

  const fileName = resumeFileKey.split("/").pop() ?? "View Resume"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm font-medium mb-1">Resume to be submitted</p>
          <a
            href={resumeFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary truncate hover:underline block"
          >
            {fileName}
          </a>
        </div>

        <FormField
          name="coverLetter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value ?? ""} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Apply
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}
