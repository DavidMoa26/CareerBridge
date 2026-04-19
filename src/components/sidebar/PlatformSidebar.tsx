import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SignedIn } from '@/services/clerk/components/SignInStatus';
import { PlatformSidebarClient } from './_PlatformSidebarClient';
import { ReactNode } from 'react';
import Image from 'next/image';

export function PlatformSidebar({
  children,
  content,
  footerButton,
}: {
  children: ReactNode;
  content: ReactNode;
  footerButton: ReactNode;
}) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <PlatformSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden border-r-0">
          {/* ── Brand Header ─────────────────────────────────────────── */}
          <SidebarHeader className="p-0">
            {/* Trigger row — only icon visible when collapsed */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <SidebarTrigger className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors duration-150 -ml-1" />
            </div>

            {/* Brand block — hidden when collapsed */}
            <div className="px-6 pb-5 group-data-[state=collapsed]:hidden">
              <div className="flex items-center gap-3 mb-1">
                {/* Logo mark — mix-blend-screen removes any white bg on dark */}
                <div className="shrink-0 size-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-cb-sm relative overflow-hidden">
                  <div className="relative w-[180px] h-[48px]">
                    <Image
                      src="/logo.png"
                      alt="CareerBridge"
                      fill
                      sizes="180px"
                      className="object-contain mix-blend-screen brightness-200 p-1"
                      priority
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-base leading-tight tracking-tight">
                    CareerBridge
                  </p>
                  <p className="text-slate-400 text-xs leading-tight mt-0.5">
                    Your next chapter begins here
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 h-px bg-slate-800 group-data-[state=collapsed]:hidden" />
          </SidebarHeader>

          {/* ── Nav Content ──────────────────────────────────────────── */}
          <SidebarContent className="px-3 py-3">{content}</SidebarContent>

          {/* ── User Footer ──────────────────────────────────────────── */}
          <SignedIn>
            <SidebarFooter className="px-3 py-3 border-t border-slate-800">
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>

        {/* ── Main Content Area ─────────────────────────────────────── */}
        <main className="flex-1 min-h-screen bg-slate-50">{children}</main>
      </PlatformSidebarClient>
    </SidebarProvider>
  );
}
