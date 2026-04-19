'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReactNode } from 'react';
import Image from 'next/image';

export function AppSidebarClient({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="p-2 border-b flex items-center gap-2">
          <SidebarTrigger />
          <Image
            src="/logo.png"
            alt="CareerBridge"
            width={130}
            height={36}
            sizes="130px"
            style={{
              width: '130px',
              height: 'auto',
            }}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex-1 flex">{children}</div>
      </div>
    );
  }

  return children;
}
