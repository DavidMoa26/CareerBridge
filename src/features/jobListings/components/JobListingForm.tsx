'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobListingSchema } from '../actions/schemas';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { JobListingTable } from '@/drizzle/schema';
import { createJobListing, updateJobListing } from '../actions/actions';
import { toast } from 'sonner';
import { JobListingWizard } from './JobListingWizard';

export function JobListingForm({
  jobListing,
}: {
  jobListing?: Pick<
    typeof JobListingTable.$inferSelect,
    | 'title'
    | 'description'
    | 'experienceLevel'
    | 'id'
    | 'country'
    | 'type'
    | 'wage'
    | 'wageInterval'
    | 'city'
    | 'locationRequirement'
  >;
}) {
  const form = useForm({
    resolver: zodResolver(jobListingSchema),
    defaultValues: jobListing ?? {
      title: '',
      description: '',
      country: null,
      city: null,
      wage: null,
      wageInterval: 'yearly',
      experienceLevel: 'junior',
      type: 'full-time',
      locationRequirement: 'in-office',
    },
  });

  async function onSubmit(data: z.infer<typeof jobListingSchema>) {
    const action = jobListing
      ? updateJobListing.bind(null, jobListing.id)
      : createJobListing;
    const res = await action(data);

    if (res.error) {
      toast.error(res.message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 @container"
      >
        <JobListingWizard
          isEditing={jobListing != null}
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
