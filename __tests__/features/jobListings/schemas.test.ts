import { jobListingSchema } from "@/features/jobListings/actions/schemas"

const validBase = {
  title: "Software Engineer",
  description: "Build things.",
  experienceLevel: "junior" as const,
  locationRequirement: "remote" as const,
  type: "full-time" as const,
  wage: null,
  wageInterval: null,
  country: null,
  city: null,
}

describe("jobListingSchema", () => {
  it("accepts a valid remote listing with no wage", () => {
    expect(jobListingSchema.safeParse(validBase).success).toBe(true)
  })

  it("accepts a valid in-office listing with city and country", () => {
    const data = {
      ...validBase,
      locationRequirement: "in-office" as const,
      city: "Tel Aviv",
      country: "Israel",
    }
    expect(jobListingSchema.safeParse(data).success).toBe(true)
  })

  it("accepts wage with wageInterval", () => {
    const data = { ...validBase, wage: 50, wageInterval: "hourly" as const }
    expect(jobListingSchema.safeParse(data).success).toBe(true)
  })

  it("rejects title shorter than 3 chars", () => {
    const result = jobListingSchema.safeParse({ ...validBase, title: "AB" })
    expect(result.success).toBe(false)
  })

  it("rejects wage without wageInterval", () => {
    const result = jobListingSchema.safeParse({
      ...validBase,
      wage: 50,
      wageInterval: null,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map(i => i.path.join("."))
      expect(paths).toContain("wageInterval")
    }
  })

  it("rejects in-office listing without city", () => {
    const result = jobListingSchema.safeParse({
      ...validBase,
      locationRequirement: "in-office" as const,
      city: null,
      country: "Israel",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map(i => i.path.join("."))
      expect(paths).toContain("city")
    }
  })

  it("rejects in-office listing without country", () => {
    const result = jobListingSchema.safeParse({
      ...validBase,
      locationRequirement: "in-office" as const,
      city: "Tel Aviv",
      country: null,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map(i => i.path.join("."))
      expect(paths).toContain("country")
    }
  })

  it("trims empty-string city to null", () => {
    const result = jobListingSchema.safeParse({ ...validBase, city: "  " })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.city).toBeNull()
  })
})
