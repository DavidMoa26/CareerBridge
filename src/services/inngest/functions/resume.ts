import { db } from "@/drizzle/db"
import { inngest } from "../client"
import { eq } from "drizzle-orm"
import { UserResumeTable } from "@/drizzle/schema"
import { env } from "@/data/env/server"
import { updateUserResume } from "@/features/users/db/userResumes"

export const createAiSummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary of Uploaded Resume",
    concurrency: { limit: 5 }, // Prevent API rate limiting
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user

    const userResume = await step.run("get-user-resume", async () => {
      return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: { resumeFileUrl: true },
      })
    })

    if (userResume == null) return

    const pdfBase64 = await step.run("fetch-pdf", async () => {
      const fileUrl = new URL(userResume.resumeFileUrl)

      // SSRF prevention: whitelist UploadThing domains (utfs.io legacy + ufs.sh current)
      const allowedDomains = ["utfs.io", "ufs.sh"]
      if (!allowedDomains.some(domain => fileUrl.hostname.endsWith(domain))) {
        throw new Error(
          `Invalid resume URL domain: ${fileUrl.hostname}. Only UploadThing URLs are allowed.`
        )
      }

      const response = await fetch(userResume.resumeFileUrl)

      // Validate response size (max 10MB for PDF)
      const contentLength = response.headers.get("content-length")
      if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
        throw new Error(
          `Resume file too large: ${Math.round(parseInt(contentLength) / 1024 / 1024)}MB. Max 10MB allowed.`
        )
      }

      // Validate content type
      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("pdf")) {
        throw new Error(
          `Invalid file type: ${contentType}. Only PDF files are allowed.`
        )
      }

      const buffer = await response.arrayBuffer()
      return Buffer.from(buffer).toString("base64")
    })

    const result = await step.ai.infer("create-ai-summary", {
      model: step.ai.models.anthropic({
        model: "claude-haiku-4-5-20251001",
        defaultParameters: { max_tokens: 2048 },
        apiKey: env.ANTHROPIC_API_KEY,
      }),
      body: {
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: pdfBase64,
                },
              },
              {
                type: "text",
                text: "Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.",
              },
            ],
          },
        ],
      },
    })

    await step.run("save-ai-summary", async () => {
      const message = result.content[0]
      if (message.type !== "text") return

      await updateUserResume(userId, { aiSummary: message.text })
    })
  }
)
