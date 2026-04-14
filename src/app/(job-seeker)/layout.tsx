import { PlatformSidebar } from "@/components/sidebar/PlatformSidebar"
import { NavMenuSection } from "@/components/sidebar/NavMenuSection"
import { MotionPageWrapper } from "@/components/MotionPageWrapper"
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton"
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboard,
  LogInIcon,
} from "lucide-react"
import { ReactNode } from "react"

export default function JobSeekerLayout({
  children,
  sidebar,
}: {
  children: ReactNode
  sidebar: ReactNode
}) {
  return (
    <PlatformSidebar
      content={
        <>
          {sidebar}
          <NavMenuSection
            className="mt-auto"
            items={[
              { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
              {
                href: "/ai-search",
                icon: <BrainCircuitIcon />,
                label: "AI Search",
              },
              {
                href: "/employer",
                icon: <LayoutDashboard />,
                label: "Employer Dashboard",
                authStatus: "signedIn",
              },
              {
                href: "/sign-in",
                icon: <LogInIcon />,
                label: "Sign In",
                authStatus: "signedOut",
              },
            ]}
          />
        </>
      }
      footerButton={<SidebarUserButton />}
    >
      <MotionPageWrapper>{children}</MotionPageWrapper>
    </PlatformSidebar>
  )
}
