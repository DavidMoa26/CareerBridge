'use client'

import { useClerk } from '@clerk/nextjs'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { LogOutIcon } from 'lucide-react'

export function SignOutMenuButton() {
  const { signOut } = useClerk()

  return (
    <SidebarMenuButton onClick={() => signOut()}>
      <LogOutIcon />
      <span>Log Out</span>
    </SidebarMenuButton>
  )
}
