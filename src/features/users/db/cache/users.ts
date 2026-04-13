import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getUserGlobalTag() {
  return getGlobalTag('users');
}

export function getUserIdTag(id: string) {
  return getIdTag('users', id);
}

export function revalidateUserCache(id: string) {
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getUserGlobalTag());
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getUserIdTag(id));
}
