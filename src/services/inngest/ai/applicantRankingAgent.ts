import { env } from "@/data/env/server"
import { updateJobListingApplication } from "@/features/jobListingApplications/db/jobListingsApplications"
import { GoogleGenerativeAI, SchemaType, FunctionCallingMode } from "@google/generative-ai"

const SYSTEM_PROMPT =
  "You are an objective corporate recruiter ranking job applicants. You will be provided with a user prompt containing a user's id, resumeSummary, coverLetter (which may be 'No cover letter provided'), and the job listing in JSON. Rate the applicant 1–5 based strictly on how well they meet the job's requirements. Rating scale: 5 = perfect or near-perfect match on all core requirements; 4 = meets most requirements with minor gaps; 3 = meets some requirements but has notable gaps; 2 = meets few requirements or is significantly underqualified; 1 = does not meet the core requirements. Seniority and experience level are hard requirements: if the job requires 'Senior' or a specific number of years of experience and the applicant is junior or falls well short of that threshold, you MUST give a rating of 1 or 2 regardless of resume quality. Do not reward potential or transferable skills when hard requirements are unmet. A missing cover letter does not affect the rating. You MUST always call the save-applicant-ranking tool to record the rating. Do not return any text output."

export async function rankApplicant(input: {
  coverLetter: string
  resumeSummary: string
  jobListingId: string
  userId: string
  jobListing: object
}) {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    tools: [
      {
        functionDeclarations: [
          {
            name: "save-applicant-ranking",
            description:
              "Saves the applicant's ranking for a specific job listing in the database",
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                rating: {
                  type: SchemaType.NUMBER,
                  description: "Rating from 1 to 5",
                },
                jobListingId: {
                  type: SchemaType.STRING,
                  description: "The job listing ID",
                },
                userId: {
                  type: SchemaType.STRING,
                  description: "The user ID",
                },
              },
              required: ["rating", "jobListingId", "userId"],
            },
          },
        ],
      },
    ],
    toolConfig: {
      functionCallingConfig: {
        mode: FunctionCallingMode.ANY,
        allowedFunctionNames: ["save-applicant-ranking"],
      },
    },
  })

  const result = await model.generateContent(JSON.stringify(input))
  const response = result.response
  const part = response.candidates?.[0]?.content?.parts?.find(
    p => p.functionCall != null
  )

  if (part?.functionCall == null) {
    throw new Error(
      `Applicant ranking tool was not invoked for userId=${input.userId} jobListingId=${input.jobListingId}`
    )
  }

  const { rating, jobListingId, userId } = part.functionCall.args as {
    rating: number
    jobListingId: string
    userId: string
  }

  await updateJobListingApplication({ jobListingId, userId }, { rating })
}
