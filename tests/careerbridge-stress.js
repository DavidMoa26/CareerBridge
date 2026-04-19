// careerbridge-stress.js
import http from "k6/http";
import { check } from "k6";
import { Rate, Trend } from "k6/metrics";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const errorRate = new Rate("errors");
const dbLatency = new Trend("db_heavy_latency");

const BASE_URL = "http://178.105.0.184:3000";

export const options = {
  stages: [
    { duration: "2m", target: 800 },
    { duration: "5m", target: 800 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    errors: ["rate<0.20"],
    http_req_duration: ["p(95)<5000"],
  },
};

const searchQueries = [
  "q=senior+software+engineer&location=remote&salary=120000&skills=react,node,postgres",
  "q=product+manager&location=new+york&experience=5&industry=fintech",
  "q=data+scientist&skills=python,tensorflow,sql&remote=true&level=mid",
  "q=devops+engineer&skills=kubernetes,docker,aws&salary=140000",
];

export default function () {
  const clerkPayload = JSON.stringify({
    type: "user.created",
    data: { id: `user_stress_${__VU}_${__ITER}`, email_addresses: [] },
  });

  const query = searchQueries[__ITER % searchQueries.length];

  const responses = http.batch([
    // Heavy: triggers Clerk middleware + webhook parsing
    [
      "POST",
      `${BASE_URL}/api/webhooks/clerk`,
      clerkPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "svix-id": `msg_stress_${__VU}`,
          "svix-timestamp": `${Date.now()}`,
          "svix-signature": "v1,invalid_signature",
        },
        tags: { endpoint: "webhook" },
      },
    ],
    // Heavy: DB query + potential AI ranking logic
    [
      "GET",
      `${BASE_URL}/search?${query}`,
      null,
      { tags: { endpoint: "search" } },
    ],
    // Heavy: multiple DB joins (listings + org + applicant counts)
    [
      "GET",
      `${BASE_URL}/job-listings`,
      null,
      { tags: { endpoint: "listings" } },
    ],
    // Secondary: static-ish but still hits Next.js runtime
    [
      "GET",
      `${BASE_URL}/`,
      null,
      { tags: { endpoint: "home" } },
    ],
  ]);

  responses.forEach((res) => {
    const ok = check(res, {
      "not 5xx": (r) => r.status < 500,
      "responded": (r) => r.status !== 0,
    });
    errorRate.add(!ok);

    if (res.request.tags && res.request.tags.endpoint === "search") {
      dbLatency.add(res.timings.duration);
    }
  });
}

export function handleSummary(data) {
  return {
    "tests/stress-report.html": htmlReport(data),
    "tests/stress-results.json": JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
