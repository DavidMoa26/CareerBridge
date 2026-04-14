import type { Config } from "jest"
import nextJest from "next/jest.js"

const createJestConfig = nextJest({
  // Points to your Next.js app root so next/jest can load next.config.ts
  dir: "./",
})

const config: Config = {
  testEnvironment: "node",
  // next/jest handles TypeScript via SWC — no ts-jest or babel needed
}

export default createJestConfig(config)
