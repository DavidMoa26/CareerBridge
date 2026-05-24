import { Suspense } from "react"
import { SidebarUserButtonClient } from "./_SidebarUserButtonClient"
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth"
import { SignOutMenuButton } from "@/services/clerk/components/SignOutMenuButton"
import { currentUser } from "@clerk/nextjs/server"

export function SidebarUserButton() {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  )
}

async function SidebarUserSuspense() {
  const { userId, user } = await getCurrentUser({ allData: true })

  if (userId == null) {
    return <SignOutMenuButton />
  }

  if (user != null) {
    return <SidebarUserButtonClient user={user} />
  }

  // DB user not yet synced (Inngest webhook pending) — fall back to Clerk data
  const clerkUser = await currentUser()
  if (clerkUser == null) return <SignOutMenuButton />

  const primaryEmail = clerkUser.emailAddresses.find(
    e => e.id === clerkUser.primaryEmailAddressId
  )
  const email = primaryEmail?.emailAddress ?? ""
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email

  return <SidebarUserButtonClient user={{ name, imageUrl: clerkUser.imageUrl, email }} />
}
