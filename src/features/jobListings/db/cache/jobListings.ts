import { getGlobalTag, getIdTag, getOrganizationTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getJobListingGlobalTag() {
  return getGlobalTag('jobListings');
}

export function getJobListingOrganizationTag(organizationId: string) {
  return getOrganizationTag('jobListings', organizationId);
}

export function getJobListingIdTag(id: string) {
  return getIdTag('jobListings', id);
}

export function revalidateJobListingCache({
  id,
  organizationId,
}: {
  id: string;
  organizationId: string;
}) {
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getJobListingGlobalTag());
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getJobListingOrganizationTag(organizationId));
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getJobListingIdTag(id));
}
