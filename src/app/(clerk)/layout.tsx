import Image from 'next/image';

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.png"
            alt="CareerBridge"
            width={180}
            height={48}
            sizes="180px"
            style={{
              width: '180px',
              height: 'auto',
            }}
            className="object-contain"
            priority
          />
          <p className="text-sm text-slate-500 tracking-wide">
            Find your next career opportunity
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
