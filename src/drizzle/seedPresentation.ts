/**
 * Seed script for presentation/email-testing purposes.
 *
 * Creates:
 *   1. A new "Apex Digital Labs" organization (id prefix: org_pres_)
 *   2. An organization_user_settings row linking the owner to that org
 *      with newApplicationEmailNotifications = true (required for email flow)
 *   3. 12 unique published job listings mapped to the new org
 *
 * Usage:
 *   npm run db:seed:presentation
 *
 * Cleanup:
 *   DELETE FROM job_listings WHERE "organizationId" LIKE 'org_pres_%';
 *   DELETE FROM organization_user_settings WHERE "organizationId" LIKE 'org_pres_%';
 *   DELETE FROM organizations WHERE id LIKE 'org_pres_%';
 */

import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set. Run with --env-file=.env or export it first.');
  process.exit(1);
}

const OWNER_USER_ID = 'user_3DwhFbcpEVpTQTtvAVR0JWk2xlo';
const OWNER_NAME = 'David Moalem';
const OWNER_EMAIL = 'davidmo4@ac.sce.ac.il';

const pool = new Pool({ connectionString: DATABASE_URL });


function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function desc(
  role: string,
  skills: [string, string, string, string],
  specificRequirements: string[],
  niceToHave: string[]
): string {
  const [s1, s2, s3, s4] = skills;
  return [
    `## About the Role\n\nWe are looking for a talented ${role} to join the Apex Digital Labs team. You will tackle cutting-edge challenges alongside world-class engineers. This is a high-impact role where your work directly shapes our product and platform.`,
    `## Responsibilities\n\n- Design, build, and maintain production-quality systems using ${s1} and ${s2}.\n- Collaborate with product, design, and data teams to ship features that delight users.\n- Write clean, testable, well-documented code and lead thorough code reviews.\n- Contribute to architectural decisions and help define engineering best practices.\n- Monitor system performance, identify bottlenecks, and drive reliability improvements.`,
    `## Requirements\n\n- 3+ years of professional experience with ${s1} in a production environment.\n- Strong proficiency in ${s2} and working knowledge of ${s3}.\n- Solid understanding of ${s4} and modern software engineering principles.\n${specificRequirements.map(r => `- ${r}`).join('\n')}`,
    `## Nice to Have\n\n- Experience with cloud-native infrastructure (AWS, GCP, or Azure).\n- Familiarity with containerization and orchestration (Docker, Kubernetes, Helm).\n${niceToHave.map(r => `- ${r}`).join('\n')}`,
    `## What We Offer\n\n- Competitive salary plus equity participation.\n- Flexible remote-first culture with async communication.\n- Annual learning budget ($2,500+) for courses, conferences, and certifications.\n- Top-tier hardware, comprehensive health insurance, and unlimited PTO.`,
  ].join('\n\n');
}

type ListingSeed = {
  title: string;
  description: string;
  wage: number | null;
  wageInterval: 'hourly' | 'yearly' | null;
  country: string;
  city: string;
  isFeatured: boolean;
  locationRequirement: 'remote' | 'hybrid' | 'in-office';
  experienceLevel: 'junior' | 'mid-level' | 'senior';
  status: 'published';
  type: 'full-time' | 'part-time' | 'internship';
  postedAt: Date;
};

const LISTINGS: ListingSeed[] = [
  {
    title: 'AI / LLM Integration Engineer',
    description: desc(
      'AI / LLM Integration Engineer',
      ['LangChain / LlamaIndex', 'Python', 'vector databases (Pinecone, Weaviate)', 'RAG pipeline design'],
      [
        'Hands-on experience integrating large language models (GPT-4, Claude, Gemini) into production applications.',
        'Deep understanding of retrieval-augmented generation, prompt engineering, and context-window optimization.',
        'Experience building and evaluating LLM evaluation pipelines and guardrails.',
      ],
      [
        'Contributions to open-source LLM tooling (LangChain, Haystack, DSPy).',
        'Experience with fine-tuning (LoRA / PEFT) or model distillation.',
      ]
    ),
    wage: 185000, wageInterval: 'yearly',
    country: 'Israel', city: 'Tel Aviv',
    isFeatured: true,
    locationRequirement: 'remote', experienceLevel: 'senior', status: 'published', type: 'full-time',
    postedAt: daysAgo(4),
  },
  {
    title: 'Web3 Smart Contract Developer',
    description: desc(
      'Web3 Smart Contract Developer',
      ['Solidity', 'Hardhat / Foundry', 'EVM internals', 'DeFi protocol design'],
      [
        'Experience writing and auditing production-grade Solidity smart contracts on Ethereum or EVM-compatible chains.',
        'Strong grasp of common vulnerability classes: reentrancy, flash loan attacks, oracle manipulation.',
        'Familiarity with OpenZeppelin libraries, proxy patterns (UUPS, Transparent), and upgradeable contracts.',
      ],
      [
        'Experience with Layer 2 networks (Arbitrum, Optimism, zkSync).',
        'Background in formal verification tooling (Certora, Echidna).',
      ]
    ),
    wage: 170000, wageInterval: 'yearly',
    country: 'United States', city: 'New York',
    isFeatured: false,
    locationRequirement: 'remote', experienceLevel: 'senior', status: 'published', type: 'full-time',
    postedAt: daysAgo(9),
  },
  {
    title: 'AR / XR Developer',
    description: desc(
      'AR / XR Developer',
      ['Unity (C#)', 'ARKit / ARCore', '3D spatial computing', 'shader programming'],
      [
        'Experience shipping AR or XR applications on iOS, Android, or Meta Quest platforms.',
        "Proficiency with Unity's XR Interaction Toolkit and hand-tracking APIs.",
        'Ability to optimize 3D scenes for mobile GPU/battery constraints.',
      ],
      [
        'Familiarity with Apple Vision Pro development (visionOS / RealityKit).',
        'Background in WebXR or A-Frame for browser-based immersive experiences.',
      ]
    ),
    wage: 155000, wageInterval: 'yearly',
    country: 'United States', city: 'San Francisco',
    isFeatured: false,
    locationRequirement: 'hybrid', experienceLevel: 'mid-level', status: 'published', type: 'full-time',
    postedAt: daysAgo(13),
  },
  {
    title: 'Embedded Systems Engineer',
    description: desc(
      'Embedded Systems Engineer',
      ['C / C++', 'RTOS (FreeRTOS / Zephyr)', 'ARM Cortex-M', 'hardware-software co-design'],
      [
        'Experience writing bare-metal or RTOS-based firmware for resource-constrained microcontrollers.',
        'Strong understanding of hardware communication protocols: SPI, I2C, UART, CAN bus.',
        'Proficiency with debugging tools: JTAG/SWD, oscilloscopes, and logic analyzers.',
      ],
      [
        'Experience with secure boot, OTA firmware updates, or TrustZone.',
        'Background in IoT connectivity stacks (MQTT, CoAP, BLE, LoRaWAN).',
      ]
    ),
    wage: 140000, wageInterval: 'yearly',
    country: 'Germany', city: 'Berlin',
    isFeatured: false,
    locationRequirement: 'in-office', experienceLevel: 'mid-level', status: 'published', type: 'full-time',
    postedAt: daysAgo(17),
  },
  {
    title: 'Cybersecurity Analyst',
    description: desc(
      'Cybersecurity Analyst',
      ['SIEM / SOAR platforms', 'threat hunting', 'incident response', 'network forensics'],
      [
        'Experience monitoring and triaging alerts across cloud and on-premise environments.',
        'Proficiency with SIEM tools (Splunk, Microsoft Sentinel, or Elastic Security).',
        'Solid understanding of the MITRE ATT&CK framework and threat intelligence feeds.',
      ],
      [
        'Experience with malware analysis (static and dynamic) or reverse engineering.',
        'Relevant certifications: GCIH, GCIA, CEH, or CompTIA CySA+.',
      ]
    ),
    wage: 120000, wageInterval: 'yearly',
    country: 'United Kingdom', city: 'London',
    isFeatured: false,
    locationRequirement: 'hybrid', experienceLevel: 'mid-level', status: 'published', type: 'full-time',
    postedAt: daysAgo(21),
  },
  {
    title: 'Technical Content Engineer',
    description: desc(
      'Technical Content Engineer',
      ['developer documentation', 'TypeScript / Python', 'API reference writing', 'technical tutorials'],
      [
        'Ability to write clear, accurate documentation from reading source code and internal specs.',
        'Experience producing developer-facing content: API docs, quickstart guides, code samples.',
        'Strong communication skills — comfortable interviewing engineers to extract tacit knowledge.',
      ],
      [
        'Experience with docs-as-code tooling (Docusaurus, Mintlify, Readme.io).',
        'Background as a software engineer who transitioned into technical writing.',
      ]
    ),
    wage: 95000, wageInterval: 'yearly',
    country: 'Israel', city: 'Tel Aviv',
    isFeatured: false,
    locationRequirement: 'remote', experienceLevel: 'mid-level', status: 'published', type: 'full-time',
    postedAt: daysAgo(26),
  },
  {
    title: 'Developer Advocate',
    description: desc(
      'Developer Advocate',
      ['developer relations', 'TypeScript / Python', 'public speaking & demos', 'community building'],
      [
        'Track record of producing technical content that drives developer adoption (blog posts, videos, workshops).',
        'Comfort representing the company at conferences, meetups, and online communities.',
        'Ability to build and maintain sample apps and SDKs that showcase product capabilities.',
      ],
      [
        'Experience running developer ambassador or beta programs.',
        'Background in open-source project maintenance or community moderation.',
      ]
    ),
    wage: 130000, wageInterval: 'yearly',
    country: 'United States', city: 'Austin',
    isFeatured: true,
    locationRequirement: 'remote', experienceLevel: 'senior', status: 'published', type: 'full-time',
    postedAt: daysAgo(6),
  },
  {
    title: 'Rust Systems Engineer',
    description: desc(
      'Rust Systems Engineer',
      ['Rust', 'async runtimes (Tokio)', 'systems programming', 'memory safety & performance'],
      [
        'Production experience writing safe, high-performance Rust across services or CLI tooling.',
        'Deep understanding of Rust ownership, lifetimes, trait objects, and async/await patterns.',
        'Experience profiling and optimizing Rust code at the systems level (perf, flamegraphs, valgrind).',
      ],
      [
        'Experience contributing to or maintaining open-source Rust crates.',
        'Background in WebAssembly (Wasm) or Rust FFI with C/C++ libraries.',
      ]
    ),
    wage: 200000, wageInterval: 'yearly',
    country: 'United States', city: 'New York',
    isFeatured: false,
    locationRequirement: 'remote', experienceLevel: 'senior', status: 'published', type: 'full-time',
    postedAt: daysAgo(11),
  },
  {
    title: 'Game Backend Engineer',
    description: desc(
      'Game Backend Engineer',
      ['Go / Node.js', 'real-time networking (WebSockets / UDP)', 'game server architecture', 'Redis & pub/sub'],
      [
        'Experience building low-latency multiplayer game servers or real-time matchmaking systems.',
        'Understanding of game loop design, state synchronization, and lag compensation techniques.',
        'Familiarity with anti-cheat mechanisms and server-authoritative game logic.',
      ],
      [
        'Experience with dedicated game server frameworks (Nakama, Agones, or Photon).',
        'Background in load testing real-time systems at thousands of concurrent connections.',
      ]
    ),
    wage: 145000, wageInterval: 'yearly',
    country: 'Israel', city: 'Tel Aviv',
    isFeatured: false,
    locationRequirement: 'hybrid', experienceLevel: 'mid-level', status: 'published', type: 'full-time',
    postedAt: daysAgo(16),
  },
  {
    title: 'Design Engineer',
    description: desc(
      'Design Engineer',
      ['React / TypeScript', 'Figma & design systems', 'CSS animations & motion', 'accessibility (WCAG 2.2)'],
      [
        'Rare combination of strong visual design instincts and production-quality frontend engineering.',
        'Experience building and maintaining component libraries used by multiple product teams.',
        'Deep CSS expertise: custom properties, keyframes, scroll-driven animations, and container queries.',
      ],
      [
        'Experience with Framer, Rive, or Lottie for complex interactive animations.',
        'Background contributing to or maintaining a public open-source design system.',
      ]
    ),
    wage: 125000, wageInterval: 'yearly',
    country: 'United States', city: 'San Francisco',
    isFeatured: false,
    locationRequirement: 'remote', experienceLevel: 'mid-level', status: 'published', type: 'full-time',
    postedAt: daysAgo(19),
  },
  {
    title: 'Growth & Experimentation Engineer',
    description: desc(
      'Growth & Experimentation Engineer',
      ['A/B testing frameworks', 'TypeScript / Python', 'product analytics (Amplitude, Mixpanel)', 'funnel optimization'],
      [
        'Experience designing and shipping A/B and multivariate experiments that move business metrics.',
        'Proficiency instrumenting front-end and back-end events for accurate experiment measurement.',
        'Strong statistical intuition: p-values, power analysis, novelty effects, and sequential testing.',
      ],
      [
        'Experience with feature-flag platforms (LaunchDarkly, GrowthBook, or Statsig).',
        'Background in SQL-heavy experiment analysis (Snowflake, BigQuery, or Redshift).',
      ]
    ),
    wage: 135000, wageInterval: 'yearly',
    country: 'United States', city: 'Austin',
    isFeatured: false,
    locationRequirement: 'remote', experienceLevel: 'mid-level', status: 'published', type: 'full-time',
    postedAt: daysAgo(33),
  },
  {
    title: 'Quantum Computing Research Intern',
    description: desc(
      'Quantum Computing Research Intern',
      ['Qiskit / Cirq', 'Python', 'linear algebra & quantum mechanics', 'variational quantum algorithms'],
      [
        'Currently pursuing a graduate degree in Physics, Computer Science, or Mathematics.',
        'Familiarity with quantum gates, circuit composition, and basic quantum error correction.',
        'Eagerness to prototype novel hybrid classical-quantum algorithms under mentor guidance.',
      ],
      [
        'Experience with quantum simulation frameworks (QuTiP, PennyLane).',
        'Publications or coursework in quantum information theory.',
      ]
    ),
    wage: 50, wageInterval: 'hourly',
    country: 'United States', city: 'New York',
    isFeatured: false,
    locationRequirement: 'in-office', experienceLevel: 'junior', status: 'published', type: 'internship',
    postedAt: daysAgo(50),
  },
];

async function seedPresentation(): Promise<void> {
  console.log('--- CareerBridge seedPresentation ---');
  console.log(`Owner user ID : ${OWNER_USER_ID}`);
  console.log();

  try {
    // Step 0: ensure owner user row exists (Clerk webhook may not have fired if Inngest was offline)
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [OWNER_USER_ID]
    );
    if (userCheck.rowCount === 0) {
      console.log(`  User row not found — inserting manually (Clerk webhook sync missed)`);
      await pool.query(
        `INSERT INTO users (id, name, email, "imageUrl", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [OWNER_USER_ID, OWNER_NAME, OWNER_EMAIL, '']
      );
      console.log(`✓ User row created: "${OWNER_NAME}" <${OWNER_EMAIL}>`);
    } else {
      console.log(`✓ User verified in DB`);
    }

    // Step 1: find the real Clerk org (not a seed stub)
    const orgResult = await pool.query<{ id: string; name: string }>(
      `SELECT id, name FROM organizations
       WHERE id NOT LIKE 'org_seed_%'
         AND id NOT LIKE 'org_pres_%'
       ORDER BY "createdAt" DESC
       LIMIT 1`
    );
    if (orgResult.rowCount === 0) {
      console.error('ERROR: No real Clerk organization found in the DB.');
      console.error('Create one via the app first, then re-run this script.');
      process.exit(1);
    }
    const { id: orgId, name: orgName } = orgResult.rows[0];
    console.log(`✓ Targeting org: "${orgName}" (${orgId})`);

    // Step 2: upsert org-user settings with email notifications enabled
    await pool.query(
      `INSERT INTO organization_user_settings
         ("userId", "organizationId", "newApplicationEmailNotifications", "createdAt", "updatedAt")
       VALUES ($1, $2, true, NOW(), NOW())
       ON CONFLICT ("userId", "organizationId") DO UPDATE
         SET "newApplicationEmailNotifications" = true, "updatedAt" = NOW()`,
      [OWNER_USER_ID, orgId]
    );
    console.log(`✓ Organization user settings upserted (email notifications ON)`);

    // Step 3: insert job listings via raw SQL to avoid Drizzle v0.44 country-column bug
    for (const l of LISTINGS) {
      await pool.query(
        `INSERT INTO job_listings
           ("organizationId", title, description, wage, "wageInterval",
            country, city, "isFeatured", "locationRequirement",
            "experienceLevel", status, type, "postedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          orgId, l.title, l.description, l.wage ?? null,
          l.wageInterval ?? null, l.country, l.city,
          l.isFeatured, l.locationRequirement, l.experienceLevel,
          l.status, l.type, l.postedAt,
        ]
      );
    }
    console.log(`✓ Inserted ${LISTINGS.length} published job listings`);
    console.log();

    // Summary
    console.log('Listings created:');
    LISTINGS.forEach((l, i) => {
      const wage = l.wage
        ? l.wageInterval === 'hourly'
          ? `$${l.wage}/hr`
          : `$${(l.wage / 1000).toFixed(0)}k/yr`
        : 'No wage';
      const featured = l.isFeatured ? ' ★' : '';
      console.log(`  ${String(i + 1).padStart(2)}. ${l.title}${featured} — ${wage} — ${l.city}, ${l.locationRequirement}`);
    });

    console.log();
    console.log('Seed complete!');
    console.log();
    console.log('Next steps:');
    console.log('  1. Run `npm run db:studio` to inspect the data.');
    console.log('  2. To test email delivery without waiting for the 7 AM cron:');
    console.log('     Open http://localhost:8288 → send event "app/email.daily-organization-user-applications"');
    console.log();
    console.log('Cleanup SQL:');
    console.log(`  DELETE FROM job_listings WHERE "organizationId" = '${orgId}';`);
    console.log(`  DELETE FROM organization_user_settings WHERE "organizationId" = '${orgId}';`);
    console.log(`  DELETE FROM organizations WHERE id = '${orgId}';`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedPresentation();
