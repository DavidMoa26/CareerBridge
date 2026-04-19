import {
  getNextJobListingStatus,
  sortJobListingsByStatus,
} from "@/features/jobListings/lib/utils"

describe("getNextJobListingStatus", () => {
  it("draft → published", () => {
    expect(getNextJobListingStatus("draft")).toBe("published")
  })

  it("delisted → published", () => {
    expect(getNextJobListingStatus("delisted")).toBe("published")
  })

  it("published → delisted", () => {
    expect(getNextJobListingStatus("published")).toBe("delisted")
  })
})

describe("sortJobListingsByStatus", () => {
  it("published sorts before draft", () => {
    expect(sortJobListingsByStatus("published", "draft")).toBeLessThan(0)
  })

  it("draft sorts before delisted", () => {
    expect(sortJobListingsByStatus("draft", "delisted")).toBeLessThan(0)
  })

  it("published sorts before delisted", () => {
    expect(sortJobListingsByStatus("published", "delisted")).toBeLessThan(0)
  })

  it("same status returns 0", () => {
    expect(sortJobListingsByStatus("published", "published")).toBe(0)
  })

  it("sorts an array correctly", () => {
    const statuses = ["delisted", "published", "draft"] as const
    const sorted = [...statuses].sort(sortJobListingsByStatus)
    expect(sorted).toEqual(["published", "draft", "delisted"])
  })
})
