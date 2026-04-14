import path from "path"

/**
 * Shared constants used by both auth.setup.ts and spec files.
 * Keeping these here avoids spec files importing the setup file
 * (which Playwright forbids).
 */
export const STORAGE_STATE = path.join(__dirname, ".auth/user.json")
