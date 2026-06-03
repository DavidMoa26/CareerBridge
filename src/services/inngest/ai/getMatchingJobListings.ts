import { env } from "@/data/env/server"
import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/drizzle/schema"
import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"

const listingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  wage: z.number().nullable(),
  wageInterval: z.enum(wageIntervals).nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  experienceLevel: z.enum(experienceLevels),
  type: z.enum(jobListingTypes),
  locationRequirement: z.enum(locationRequirements),
})

export async function getMatchingJobListings(
  prompt: string,
  jobListings: z.infer<typeof listingSchema>[],
  { maxNumberOfJobs }: { maxNumberOfJobs?: number } = {}
): Promise<string[]> {
  const NO_JOBS = "NO_JOBS"

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

  const systemPrompt = `You are an expert at matching job seekers with job listings. The user prompt describes what the person is looking for or their background. Match inclusively: if a job involves the searched role or skill as any significant part of the role, include it. For example, a search for "frontend developer" should include full-stack roles since they require frontend skills. ${
    maxNumberOfJobs
      ? `Return up to ${maxNumberOfJobs} jobs.`
      : `Return all jobs that match.`
  } Your response must contain ONLY a comma-separated list of jobIds with no other text, explanation, or formatting. Example response format: "id1,id2,id3". If you cannot find any jobs that match the user prompt, return only the text "${NO_JOBS}". Here is the JSON array of available job listings: ${JSON.stringify(
    jobListings.map(listing =>
      listingSchema
        .transform(listing => ({
          ...listing,
          wage: listing.wage ?? undefined,
          wageInterval: listing.wageInterval ?? undefined,
          city: listing.city ?? undefined,
          country: listing.country ?? undefined,
          locationRequirement: listing.locationRequirement ?? undefined,
        }))
        .parse(listing)
    )
  )}`

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  })

  const lastMessage = response.content.find(b => b.type === "text")?.text

  if (lastMessage == null || lastMessage.includes(NO_JOBS)) return []

  const uuidPattern =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
  return lastMessage.match(uuidPattern) ?? []
}
