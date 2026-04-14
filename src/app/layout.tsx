import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@mdxeditor/editor/style.css';
import { ClerkProvider } from '@/services/clerk/components/ClerkProvider';
import { Toaster } from '@/components/ui/sonner';
import { UploadThingSSR } from '@/services/uploadthing/components/UploadThingSSR';
import { MotionProvider } from '@/components/MotionProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CareerBridge',
  description: 'Find your next career opportunity with CareerBridge',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-cb-slate-100 text-cb-slate-900`}
        >
          {/* MotionProvider is a client boundary that sets reducedMotion="user"
              so every motion element in the tree respects the OS accessibility setting. */}
          <MotionProvider>{children}</MotionProvider>
          <Toaster />
          <UploadThingSSR />
        </body>
      </html>
    </ClerkProvider>
  );
}
