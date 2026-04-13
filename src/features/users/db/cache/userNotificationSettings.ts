import { getGlobalTag, getIdTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getUserNotificationSettingsGlobalTag() {
  return getGlobalTag('userNotificationSettings');
}

export function getUserNotificationSettingsIdTag(userId: string) {
  return getIdTag('userNotificationSettings', userId);
}

export function revalidateUserNotificationSettingsCache(userId: string) {
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getUserNotificationSettingsGlobalTag());
  // @ts-expect-error - Next.js 16 Canary requires 2 arguments for revalidateTag
  revalidateTag(getUserNotificationSettingsIdTag(userId));
}
