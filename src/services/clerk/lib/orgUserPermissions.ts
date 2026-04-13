import { auth } from "@clerk/nextjs/server"

type UserPermission =
  | "org:job_listings:create"
  | "org:job_listings:update"
  | "org:job_listings:delete"
  | "org:job_listings:change_status"
  | "org:job_listings:applications_change_rating"
  | "org:job_listings:applications_change_stage"

export async function hasOrgUserPermission(permission: UserPermission) {
  const { has } = await auth()
  return has({ permission })
}
