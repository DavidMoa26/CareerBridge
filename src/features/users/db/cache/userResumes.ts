import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getUserResumeGlobalTag() {
  return getGlobalTag('userResumes');
}

export function getUserResumeIdTag(userId: string) {
  return getIdTag('userResumes', userId);
}

export function revalidateUserResumeCache(userId: string) {
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getUserResumeGlobalTag());
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getUserResumeIdTag(userId));
}
