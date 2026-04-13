import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SignedIn } from "@/services/clerk/components/SignInStatus"
import { AppSidebarClient } from "./_AppSidebarClient"
import { ReactNode } from "react"
import Image from "next/image"

export function AppSidebar({
  children,
  content,
  footerButton,
}: {
  children: ReactNode
  content: ReactNode
  footerButton: ReactNode
}) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row items-center">
            <SidebarTrigger />
            <Image
              src="/logo.png"
              alt="CareerBridge"
              height={40}
              width={150}
              className="object-contain group-data-[state=collapsed]:hidden"
              priority
            />
          </SidebarHeader>
          <SidebarContent>{content}</SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </AppSidebarClient>
    </SidebarProvider>
  )
}
