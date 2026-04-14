"use client"

import { ReactNode } from "react"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"
import { SignedIn, SignedOut } from "@/services/clerk/components/SignInStatus"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations"

type NavItem = {
  href: string
  icon: ReactNode
  label: string
  authStatus?: "signedOut" | "signedIn"
}

export function NavMenuSection({
  items,
  className,
}: {
  items: NavItem[]
  className?: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className={className}>
      {/* motion.div drives stagger; SidebarMenu stays a plain ul */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <SidebarMenu>
          {items.map(item => {
            const isActive = pathname === item.href

            const menuItem = (
              <motion.div key={item.href} variants={staggerItemVariants}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={
                      isActive
                        ? "bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-600 hover:text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors duration-150"
                    }
                  >
                    <Link href={item.href}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            )

            if (item.authStatus === "signedOut") {
              return <SignedOut key={item.href}>{menuItem}</SignedOut>
            }

            if (item.authStatus === "signedIn") {
              return <SignedIn key={item.href}>{menuItem}</SignedIn>
            }

            return menuItem
          })}
        </SidebarMenu>
      </motion.div>
    </SidebarGroup>
  )
}
