import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getCurrentUser } from "../clerk/lib/getCurrentAuth"
import { currentUser } from "@clerk/nextjs/server"
import { inngest } from "../inngest/client"
import { upsertUserResume } from "@/features/users/db/userResumes"
import { insertUser } from "@/features/users/db/users"
import { insertUserNotificationSettings } from "@/features/users/db/userNotificationSettings"
import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import UserResumePage from "@/app/(job-seeker)/user-settings/resume/page"
import { UserResumeTable } from "@/drizzle/schema"
import { uploadthing } from "./client"

const f = createUploadthing()

export const customFileRouter = {
  resumeUploader: f(
    {
      pdf: {
        maxFileSize: "8MB",
        maxFileCount: 1,
      },
    },
    { awaitServerData: true }
  )
    .middleware(async () => {
      const { userId } = await getCurrentUser()
      if (userId == null) throw new UploadThingError("Unauthorized")

      // Ensure user row exists in DB before the upload completes.
      // Email/password users may arrive here before the Inngest webhook has
      // synced their record, causing a FK constraint failure on upsertUserResume.
      const clerkUser = await currentUser()
      if (clerkUser != null) {
        const primaryEmail = clerkUser.emailAddresses.find(
          e => e.id === clerkUser.primaryEmailAddressId
        )
        if (primaryEmail != null) {
          const name =
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            primaryEmail.emailAddress
          await insertUser({
            id: userId,
            name,
            imageUrl: clerkUser.imageUrl,
            email: primaryEmail.emailAddress,
          })
          await insertUserNotificationSettings({ userId })
        }
      }

      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata
      const resumeFileKey = await getUserResumeFileKey(userId)

      await upsertUserResume(userId, {
        resumeFileUrl: file.ufsUrl,
        resumeFileKey: file.key,
      })

      if (resumeFileKey != null) {
        await uploadthing.deleteFiles(resumeFileKey)
      }

      await inngest.send({ name: "app/resume.uploaded", user: { id: userId } })

      return { message: "Resume uploaded successfully" }
    }),
} satisfies FileRouter

export type CustomFileRouter = typeof customFileRouter

async function getUserResumeFileKey(userId: string) {
  const data = await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: {
      resumeFileKey: true,
    },
  })

  return data?.resumeFileKey
}
