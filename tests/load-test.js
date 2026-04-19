/**
 * CareerBridge — K6 Load Test
 *
 * Simulates 50–100 concurrent virtual users (VUs) over 5 minutes:
 *   - Ramp up  : 0 → 50 VUs over 60s
 *   - Sustain  : 50 VUs for 120s
 *   - Peak     : 50 → 100 VUs over 60s
 *   - Hold peak: 100 VUs for 60s
 *   - Ramp down: 100 → 0 VUs over 60s
 *
 * Each VU alternates between:
 *   1. GET /            — main job feed (no filters)
 *   2. GET /?<filters>  — filtered job feed (simulated "search")
 *   3. GET /ai-search   — AI search page (auth-gated, tests the gate path)
 *
 * Note: All data fetching in CareerBridge is server-side (SSR + Next.js cache).
 * There is no separate JSON search API — filters are query-string params on GET /.
 *
 * Usage:
 *   k6 run tests/load-test.js
 *   k6 run --env BASE_URL=https://your-domain.com tests/load-test.js
 */

import http from "k6/http"
import { check, sleep } from "k6"
import { Rate, Trend, Counter } from "k6/metrics"

// ---------------------------------------------------------------------------
// Custom metrics
// ---------------------------------------------------------------------------
const errorRate = new Rate("http_errors")
const jobFeedDuration = new Trend("job_feed_duration", true)
const searchDuration = new Trend("search_duration", true)
const aiSearchDuration = new Trend("ai_search_duration", true)
const cachedHits = new Counter("next_cache_hits") // X-NextJS-Cache: HIT

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || "http://localhost:3000"

// Realistic search filter combos — values must match the app's Zod enums exactly.
// locationRequirement: "in-office" | "hybrid" | "remote"
// experience:         "junior" | "mid-level" | "senior"
// type:               "internship" | "part-time" | "full-time"
// country:            free-text (case-insensitive match against the country column)
const SEARCH_SCENARIOS = [
  { title: "engineer" },
  { title: "designer" },
  { locationRequirement: "remote" },
  { locationRequirement: "in-office" },
  { locationRequirement: "hybrid" },
  { experience: "junior" },
  { experience: "mid-level" },
  { experience: "senior" },
  { type: "full-time" },
  { type: "part-time" },
  { type: "internship" },
  { title: "developer", locationRequirement: "remote" },
  { title: "manager", experience: "senior" },
  { locationRequirement: "remote", type: "full-time" },
  { country: "Israel", locationRequirement: "in-office" },
]

// ---------------------------------------------------------------------------
// Load stages — total wall-clock: 5 minutes (300 s)
// ---------------------------------------------------------------------------
export const options = {
  stages: [
    { duration: "60s", target: 50 },  // ramp up
    { duration: "60s", target: 50 },  // sustain
    { duration: "60s", target: 100 }, // ramp to peak
    { duration: "60s", target: 100 }, // hold peak
    { duration: "60s", target: 0 },   // ramp down
  ],

  thresholds: {
    // 95th-percentile page load under 2 s (cold) / 500 ms (cached)
    http_req_duration: ["p(95)<2000"],
    // Keep error rate below 5%
    http_errors: ["rate<0.05"],
    // Job feed specifically
    job_feed_duration: ["p(95)<2000"],
    // Filtered search
    search_duration: ["p(95)<2500"],
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildQueryString(params) {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&")
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function recordCacheHit(res) {
  const cacheHeader = res.headers["X-Nextjs-Cache"] || res.headers["x-nextjs-cache"]
  if (cacheHeader === "HIT") {
    cachedHits.add(1)
  }
}

// ---------------------------------------------------------------------------
// Shared request headers — defined once, reused by every VU iteration
// ---------------------------------------------------------------------------
const HEADERS = {
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}

// ---------------------------------------------------------------------------
// Default function — executed by every VU on every iteration
// ---------------------------------------------------------------------------
export default function vuIteration() {

  // --- Scenario 1: Main job feed (no filters) ----------------------------
  {
    const res = http.get(`${BASE_URL}/`, { headers: HEADERS })
    const ok = check(res, {
      "job feed: status 200": r => r.status === 200,
      "job feed: has content": r => r.body && r.body.length > 500,
    })
    errorRate.add(!ok)
    jobFeedDuration.add(res.timings.duration)
    recordCacheHit(res)
    sleep(randomBetween(1, 2))
  }

  // --- Scenario 2: Filtered job feed (simulated search) ------------------
  {
    const filters = pickRandom(SEARCH_SCENARIOS)
    const qs = buildQueryString(filters)
    const res = http.get(`${BASE_URL}/?${qs}`, { headers: HEADERS })
    const ok = check(res, {
      "search: status 200": r => r.status === 200,
      "search: has content": r => r.body && r.body.length > 200,
    })
    errorRate.add(!ok)
    searchDuration.add(res.timings.duration)
    recordCacheHit(res)
    sleep(randomBetween(1, 3))
  }

  // --- Scenario 3: AI search page (auth-gated, tests redirect/gate) ------
  // Runs only ~30% of iterations to reflect realistic usage ratio
  if (Math.random() < 0.3) {
    const res = http.get(`${BASE_URL}/ai-search`, { headers: HEADERS, redirects: 5 })
    const ok = check(res, {
      "ai-search: status 200 or 307": r => r.status === 200 || r.status === 307,
    })
    errorRate.add(!ok)
    aiSearchDuration.add(res.timings.duration)
    sleep(randomBetween(1, 2))
  }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}
