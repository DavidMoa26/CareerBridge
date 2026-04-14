"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { ReactNode } from "react"

export function PlatformSidebarClient({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        {/* Dark mobile topbar — matches the sidebar brand identity */}
        <div className="px-4 py-3 bg-slate-950 flex items-center gap-3 border-b border-slate-800">
          <SidebarTrigger className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors duration-150" />
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">CB</span>
            </div>
            <span className="font-semibold text-white text-sm">
              CareerBridge
            </span>
          </div>
        </div>
        <div className="flex-1 flex">{children}</div>
      </div>
    )
  }

  return children
}
