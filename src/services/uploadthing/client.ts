import { env } from "@/data/env/server"
import { UTApi } from "uploadthing/server"

export const uploadthing = new UTApi({ token: env.UPLOADTHING_TOKEN ?? "placeholder_for_build" })
