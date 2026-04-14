import Image from "next/image"

export const dynamic = "force-dynamic"

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.png"
            alt="CareerBridge"
            height={48}
            width={180}
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
  )
}
