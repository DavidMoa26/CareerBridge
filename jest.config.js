const nextJest = require("next/jest.js")

const createJestConfig = nextJest({
  // Points to your Next.js app root so next/jest can load next.config.ts
  dir: "./",
})

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
}

module.exports = createJestConfig(config)
