import { db } from "@/drizzle/db"

export async function GET() {
  try {
    // Readiness check: verify database connectivity
    await db.query.UserTable.findFirst({ limit: 1 })

    return Response.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
      },
      { status: 200 }
    )
  } catch (error) {
    // Liveness is up but readiness is down (503 Service Unavailable)
    return Response.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    )
  }
}
