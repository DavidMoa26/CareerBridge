'use client'

import { SidebarGroupAction } from '@/components/ui/sidebar'
import { useAuth } from '@clerk/nextjs'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function AddJobListingButton({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const { has } = useAuth()

  useEffect(() => setMounted(true), [])

  if (!mounted || !has?.({ permission: 'org:job_listings:create' })) return null

  return (
    <SidebarGroupAction title="Add Job Listing" asChild className={className}>
      <Link href="/employer/job-listings/new">
        <PlusIcon className="size-4" />
        <span className="sr-only">Add Job Listing</span>
      </Link>
    </SidebarGroupAction>
  )
}
