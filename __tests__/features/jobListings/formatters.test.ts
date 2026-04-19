import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobListingStatus,
  formatJobType,
  formatLocationRequirement,
  formatWage,
  formatWageInterval,
} from "@/features/jobListings/lib/formatters"

describe("formatWageInterval", () => {
  it.each([
    ["hourly", "Hour"],
    ["yearly", "Year"],
  ] as const)("%s → %s", (input, expected) => {
    expect(formatWageInterval(input)).toBe(expected)
  })
})

describe("formatLocationRequirement", () => {
  it.each([
    ["remote", "Remote"],
    ["in-office", "In Office"],
    ["hybrid", "Hybrid"],
  ] as const)("%s → %s", (input, expected) => {
    expect(formatLocationRequirement(input)).toBe(expected)
  })
})

describe("formatExperienceLevel", () => {
  it.each([
    ["junior", "Junior"],
    ["mid-level", "Mid Level"],
    ["senior", "Senior"],
  ] as const)("%s → %s", (input, expected) => {
    expect(formatExperienceLevel(input)).toBe(expected)
  })
})

describe("formatJobType", () => {
  it.each([
    ["full-time", "Full Time"],
    ["part-time", "Part Time"],
    ["internship", "Internship"],
  ] as const)("%s → %s", (input, expected) => {
    expect(formatJobType(input)).toBe(expected)
  })
})

describe("formatJobListingStatus", () => {
  it.each([
    ["published", "Active"],
    ["draft", "Draft"],
    ["delisted", "Delisted"],
  ] as const)("%s → %s", (input, expected) => {
    expect(formatJobListingStatus(input)).toBe(expected)
  })
})

describe("formatWage", () => {
  it("formats hourly wage", () => {
    expect(formatWage(25, "hourly")).toBe("$25 / hr")
  })

  it("formats yearly wage", () => {
    expect(formatWage(80000, "yearly")).toBe("$80,000")
  })
})

describe("formatJobListingLocation", () => {
  it("returns None when both null", () => {
    expect(formatJobListingLocation({ country: null, city: null })).toBe("None")
  })

  it("returns city only", () => {
    expect(formatJobListingLocation({ country: null, city: "Tel Aviv" })).toBe(
      "Tel Aviv"
    )
  })

  it("returns country only", () => {
    expect(formatJobListingLocation({ country: "Israel", city: null })).toBe(
      "Israel"
    )
  })

  it("returns city, country", () => {
    expect(
      formatJobListingLocation({ country: "Israel", city: "Tel Aviv" })
    ).toBe("Tel Aviv, Israel")
  })
})
