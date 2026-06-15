import { GET } from "@/app/api/health/route"

jest.mock("@/drizzle/db", () => ({
  db: {
    query: {
      UserTable: {
        findFirst: jest.fn(),
      },
    },
  },
}))

describe("GET /api/health", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns 200 when database is connected", async () => {
    const { db } = require("@/drizzle/db")
    db.query.UserTable.findFirst.mockResolvedValue({ id: "test" })

    const response = await GET()

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.status).toBe("ok")
    expect(body.database).toBe("connected")
    expect(body.timestamp).toBeDefined()
  })

  it("returns 503 when database is disconnected", async () => {
    const { db } = require("@/drizzle/db")
    db.query.UserTable.findFirst.mockRejectedValue(
      new Error("Connection timeout")
    )

    const response = await GET()

    expect(response.status).toBe(503)
    const body = await response.json()
    expect(body.status).toBe("error")
    expect(body.database).toBe("disconnected")
    expect(body.error).toContain("Connection timeout")
  })
})
