import { sortApplicationsByStage } from "@/features/jobListingApplications/lib/utils"

describe("sortApplicationsByStage", () => {
  it("applied sorts before interested", () => {
    expect(sortApplicationsByStage("applied", "interested")).toBeLessThan(0)
  })

  it("hired sorts before denied", () => {
    expect(sortApplicationsByStage("hired", "denied")).toBeLessThan(0)
  })

  it("same stage returns 0", () => {
    expect(sortApplicationsByStage("applied", "applied")).toBe(0)
  })

  it("sorts an array into the correct pipeline order", () => {
    const stages = ["denied", "hired", "applied", "interviewed", "interested"] as const
    const sorted = [...stages].sort(sortApplicationsByStage)
    expect(sorted).toEqual([
      "applied",
      "interested",
      "interviewed",
      "hired",
      "denied",
    ])
  })
})
