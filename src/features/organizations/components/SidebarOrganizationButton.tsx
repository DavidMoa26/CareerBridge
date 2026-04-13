import { Suspense } from "react"
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth"
import { SignOutMenuButton } from "@/services/clerk/components/SignOutMenuButton"
import { SidebarOrganizationButtonClient } from "./_SidebarOrganizationButtonClient"

export function SidebarOrganizationButton() {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  )
}

async function SidebarOrganizationSuspense() {
  const [{ user }, { organization }] = await Promise.all([
    getCurrentUser({ allData: true }),
    getCurrentOrganization({ allData: true }),
  ])

  if (user == null || organization == null) {
    return <SignOutMenuButton />
  }

  return (
    <SidebarOrganizationButtonClient user={user} organization={organization} />
  )
}
