/**
 * CareerBridge demo seed script.
 *
 * Creates 7-10 Organizations (all owned by the Primary Employer in Clerk)
 * and 50-60 published Job Listings distributed across them.
 *
 * Usage:
 *   npm run db:seed
 *
 * The script uses a standalone pg.Pool connection so it only needs DATABASE_URL
 * and does not trigger t3-oss env validation for unrelated services.
 *
 * Primary Employer (Clerk user): user_3CGmVORUsSxzFqm7VISpBhmgBpT
 * Restricted Seeker (never touched): user_3CGQp3jY4M8AIiAF1cko4JsFKGv
 */

import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { JobListingTable, OrganizationTable } from './schema';

// ---------------------------------------------------------------------------
// Database connection (standalone — avoids t3-oss full-env validation)
// ---------------------------------------------------------------------------

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error(
    'ERROR: DATABASE_URL is not set. Run with --env-file=.env or export it first.',
  );
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const db = drizzle(pool);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// For documentation / logging only — not inserted into DB
const PRIMARY_EMPLOYER_ID = 'user_3CGmVORUsSxzFqm7VISpBhmgBpT';

// These org IDs start with "org_seed_" so they are easy to identify and
// clean up later (e.g. DELETE FROM organizations WHERE id LIKE 'org_seed_%').
function makeSeedOrgId(): string {
  return 'org_seed_' + faker.string.alphanumeric(20);
}

// ---------------------------------------------------------------------------
// Category definitions
// ---------------------------------------------------------------------------

type Category = {
  title: () => string;
  skills: string[];
  seniority: string;
};

const CATEGORIES: Category[] = [
  {
    title: () =>
      faker.helpers.arrayElement([
        'Full Stack Engineer',
        'Full Stack Developer',
        'Software Engineer (Full Stack)',
        'Senior Full Stack Developer',
      ]),
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'REST APIs',
      'GraphQL',
      'Tailwind CSS',
    ],
    seniority: 'Full Stack',
  },
  {
    title: () =>
      faker.helpers.arrayElement([
        'QA Engineer',
        'Senior QA Automation Engineer',
        'SDET',
        'Quality Assurance Engineer',
        'Test Automation Engineer',
      ]),
    skills: [
      'Playwright',
      'Jest',
      'Cypress',
      'Selenium',
      'test automation',
      'CI/CD pipelines',
      'BDD/TDD',
      'API testing',
    ],
    seniority: 'QA',
  },
  {
    title: () =>
      faker.helpers.arrayElement([
        'Backend Engineer',
        'Backend Developer',
        'Software Engineer (Backend)',
        'Node.js Developer',
        'Python Backend Engineer',
      ]),
    skills: [
      'Node.js',
      'Python',
      'Go',
      'REST APIs',
      'microservices',
      'PostgreSQL',
      'Redis',
      'message queues',
    ],
    seniority: 'Backend',
  },
  {
    title: () =>
      faker.helpers.arrayElement([
        'DevOps Engineer',
        'Site Reliability Engineer',
        'Platform Engineer',
        'Cloud Infrastructure Engineer',
        'MLOps Engineer',
      ]),
    skills: [
      'Docker',
      'Kubernetes',
      'Terraform',
      'CI/CD',
      'AWS',
      'GCP',
      'Linux',
      'monitoring & alerting',
    ],
    seniority: 'DevOps',
  },
  {
    title: () =>
      faker.helpers.arrayElement([
        'Product Manager',
        'Senior Product Manager',
        'Technical Product Manager',
        'Group Product Manager',
      ]),
    skills: [
      'product roadmaps',
      'stakeholder management',
      'agile / scrum',
      'OKRs',
      'user research',
      'data-driven decision making',
      'PRD writing',
    ],
    seniority: 'Product',
  },
  {
    title: () =>
      faker.helpers.arrayElement([
        'Data Scientist',
        'Senior Data Scientist',
        'ML Engineer',
        'Applied Scientist',
        'Data Scientist – NLP',
      ]),
    skills: [
      'Python',
      'machine learning',
      'pandas',
      'scikit-learn',
      'SQL',
      'data pipelines',
      'statistical modeling',
      'PyTorch / TensorFlow',
    ],
    seniority: 'Data',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function weightedPick<T>(options: T[], weights: number[]): T {
  const total = weights.reduce((s, w) => s + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < options.length; i++) {
    r -= weights[i];
    if (r <= 0) return options[i];
  }
  return options[options.length - 1];
}

function buildDescription(category: Category): string {
  const skill1 = faker.helpers.arrayElement(category.skills);
  const skill2 = faker.helpers.arrayElement(
    category.skills.filter((s) => s !== skill1),
  );
  const skill3 = faker.helpers.arrayElement(
    category.skills.filter((s) => s !== skill1 && s !== skill2),
  );

  const roleContext = `We are looking for a talented ${category.seniority} professional to join our growing team. ${faker.company.catchPhrase()}. This is an exciting opportunity to make a real impact in a fast-paced environment.`;

  const responsibilities = [
    `Design, build, and maintain high-quality software solutions with a focus on ${skill1} and ${skill2}.`,
    `Collaborate closely with cross-functional teams including product, design, and QA to deliver exceptional user experiences.`,
    `Write clean, testable, well-documented code and participate in thorough code reviews.`,
    `Contribute to technical architecture decisions and help set engineering best practices.`,
    `Monitor system performance and proactively identify and resolve bottlenecks.`,
  ];

  const requirements = [
    `Must have 3+ years of hands-on experience with ${skill1}.`,
    `Strong proficiency in ${skill2} and familiarity with ${skill3}.`,
    `Experience working in an agile development environment with cross-functional teams.`,
    `Excellent communication skills — you can articulate technical trade-offs to non-technical stakeholders.`,
    `A growth mindset, strong attention to detail, and the ability to work independently.`,
  ];

  const niceToHave = [
    `Familiarity with Playwright or similar end-to-end testing frameworks.`,
    `Experience with cloud platforms (AWS, GCP, or Azure).`,
    `Prior exposure to startup or high-growth company environments.`,
    `Open-source contributions or a demonstrable portfolio of side projects.`,
  ];

  return [
    `## About the Role\n\n${roleContext}`,
    `## Responsibilities\n\n${responsibilities.map((r) => `- ${r}`).join('\n')}`,
    `## Requirements\n\n${requirements.map((r) => `- ${r}`).join('\n')}`,
    `## Nice to Have\n\n${niceToHave
      .slice(0, 3)
      .map((r) => `- ${r}`)
      .join('\n')}`,
    `## What We Offer\n\n${faker.lorem.sentences(3, ' ')} We believe in continuous learning, so you will have access to a dedicated learning budget and regular knowledge-sharing sessions.`,
  ].join('\n\n');
}

// ---------------------------------------------------------------------------
// Organization factory
// ---------------------------------------------------------------------------

function generateOrganizations(count: number) {
  return Array.from({ length: count }, () => ({
    id: makeSeedOrgId(),
    name: faker.company.name(),
    imageUrl: null as string | null,
  }));
}

// ---------------------------------------------------------------------------
// Job Listing factory
// ---------------------------------------------------------------------------

const LOCATION_CONFIG: Array<{ country: string; cities: string[] }> = [
  {
    country: 'Israel',
    cities: ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beer Sheva'],
  },
  {
    country: 'United States',
    cities: ['New York', 'San Francisco', 'Austin', 'Seattle'],
  },
  { country: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg'] },
  { country: 'United Kingdom', cities: ['London', 'Manchester', 'Edinburgh'] },
];

function generateListing(orgId: string) {
  const category = faker.helpers.arrayElement(CATEGORIES);

  // Location
  const locationConfig = weightedPick(LOCATION_CONFIG, [50, 30, 10, 10]);
  const city = faker.helpers.arrayElement(locationConfig.cities);
  const country = locationConfig.country;

  // Location requirement
  const locationRequirement = weightedPick(
    ['remote', 'hybrid', 'in-office'] as const,
    [40, 35, 25],
  );

  // Wage
  const hasWage = Math.random() < 0.8;
  const isHourly = Math.random() < 0.2;
  const wage = hasWage
    ? isHourly
      ? faker.number.int({ min: 40, max: 150 })
      : faker.number.int({ min: 80000, max: 250000 })
    : null;
  const wageInterval = hasWage
    ? isHourly
      ? ('hourly' as const)
      : ('yearly' as const)
    : null;

  // Experience level
  const experienceLevel = weightedPick(
    ['junior', 'mid-level', 'senior'] as const,
    [25, 45, 30],
  );

  // Job type
  const type = weightedPick(
    ['full-time', 'part-time', 'internship'] as const,
    [70, 15, 15],
  );

  // postedAt — somewhere in the last 90 days
  const postedAt = faker.date.recent({ days: 90 });

  return {
    organizationId: orgId,
    title: category.title(),
    description: buildDescription(category),
    wage,
    wageInterval,
    country,
    city,
    isFeatured: Math.random() < 0.15,
    locationRequirement,
    experienceLevel,
    status: 'published' as const,
    type,
    postedAt,
  };
}

function generateListings(count: number, orgIds: string[]) {
  return Array.from({ length: count }, (_, i) => {
    // Round-robin base + small random shift for natural distribution
    const baseIndex = i % orgIds.length;
    const jitter =
      Math.random() < 0.3
        ? faker.number.int({ min: 0, max: orgIds.length - 1 })
        : 0;
    const orgId = orgIds[(baseIndex + jitter) % orgIds.length];
    return generateListing(orgId);
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  console.log('--- CareerBridge seed ---');
  console.log(`Primary Employer (Clerk): ${PRIMARY_EMPLOYER_ID}`);
  console.log();

  try {
    // Step 1: Organizations
    const orgCount = faker.number.int({ min: 7, max: 10 });
    const orgs = generateOrganizations(orgCount);

    await db.insert(OrganizationTable).values(orgs);
    console.log(`✓ Inserted ${orgs.length} organizations:`);
    orgs.forEach((o) => console.log(`    ${o.id}  "${o.name}"`));

    // Step 2: Job Listings
    const listingCount = faker.number.int({ min: 50, max: 60 });
    const orgIds = orgs.map((o) => o.id);
    const listings = generateListings(listingCount, orgIds);

    await db.insert(JobListingTable).values(listings);
    console.log();
    console.log(`✓ Inserted ${listings.length} published job listings`);

    // Summary per org
    const perOrg = orgIds.map((id) => ({
      id,
      name: orgs.find((o) => o.id === id)!.name,
      count: listings.filter((l) => l.organizationId === id).length,
    }));
    perOrg.forEach((o) =>
      console.log(`    ${o.count} listings  →  "${o.name}"`),
    );

    console.log();
    console.log('Seed complete. Run `npm run db:studio` to inspect the data.');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
