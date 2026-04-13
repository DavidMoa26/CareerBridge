import { Suspense } from "react"
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import { SignOutMenuButton } from "@/services/clerk/components/SignOutMenuButton"

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  )
}

async function SidebarUserSuspense() {
  const { user } = await getCurrentUser({ allData: true })

  if (user == null) {
    return <SignOutMenuButton />
  }

  return <SidebarUserButtonClient user={user} />
}
