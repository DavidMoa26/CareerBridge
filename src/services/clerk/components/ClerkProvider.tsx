'use client';

import { ClerkProvider as OriginalClerkProvider } from '@clerk/nextjs';
import { ReactNode, Suspense } from 'react';

export function ClerkProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <OriginalClerkProvider
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
        appearance={{
          variables: {
            colorBackground: '#ffffff',
            colorText: '#0f172a',
            colorTextSecondary: '#475569',
            colorInputBackground: '#ffffff',
            colorInputText: '#0f172a',
          },
        }}
      >
        {children}
      </OriginalClerkProvider>
    </Suspense>
  );
}
