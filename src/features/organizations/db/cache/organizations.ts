import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getOrganizationGlobalTag() {
  return getGlobalTag('organizations');
}

export function getOrganizationIdTag(id: string) {
  return getIdTag('organizations', id);
}

export function revalidateOrganizationCache(id: string) {
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getOrganizationGlobalTag());
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getOrganizationIdTag(id));
}
