import { inngest } from "@/services/inngest/client"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => {
    headers[key] = value
  })

  const payload = JSON.parse(raw) as { type: string; data: unknown }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await inngest.send({
    name: `clerk/${payload.type}`,
    data: { raw, headers, data: payload.data },
  } as any)

  return new Response("OK", { status: 200 })
}
