import { env } from "@/data/env/server"
import { updateJobListingApplication } from "@/features/jobListingApplications/db/jobListingsApplications"
import { createAgent, createTool, gemini } from "@inngest/agent-kit"
import { z } from "zod"

const saveApplicantRatingTool = createTool({
  name: "save-applicant-ranking",
  description:
    "Saves the applicant's ranking for a specific job listing in the database",
  parameters: z.object({
    rating: z.number().int().max(5).min(1),
    jobListingId: z.string(),
    userId: z.string(),
  }),
  handler: async ({ jobListingId, rating, userId }) => {
    await updateJobListingApplication({ jobListingId, userId }, { rating })

    return "Successfully saved applicant ranking score."
  },
})

export const applicantRankingAgent = createAgent({
  name: "Applicant Ranking Agent",
  description:
    "Agent for ranking job applicants for specific job listings based on their resume and optional cover letter.",
  system:
    "You are an objective corporate recruiter ranking job applicants. You will be provided with a user prompt containing a user's id, resumeSummary, coverLetter (which may be 'No cover letter provided'), and the job listing in JSON. Rate the applicant 1–5 based strictly on how well they meet the job's requirements. Rating scale: 5 = perfect or near-perfect match on all core requirements; 4 = meets most requirements with minor gaps; 3 = meets some requirements but has notable gaps; 2 = meets few requirements or is significantly underqualified; 1 = does not meet the core requirements. Seniority and experience level are hard requirements: if the job requires 'Senior' or a specific number of years of experience and the applicant is junior or falls well short of that threshold, you MUST give a rating of 1 or 2 regardless of resume quality. Do not reward potential or transferable skills when hard requirements are unmet. A missing cover letter does not affect the rating. You MUST always call the save-applicant-ranking tool to record the rating. Do not return any text output.",
  tools: [saveApplicantRatingTool],
  tool_choice: "save-applicant-ranking",
  model: gemini({
    model: "gemini-2.5-flash",
    apiKey: env.GEMINI_API_KEY,
  }),
})
