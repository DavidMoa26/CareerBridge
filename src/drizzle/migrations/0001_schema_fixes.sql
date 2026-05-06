ALTER TABLE "job_listings" RENAME COLUMN "stateAbbreviation" TO "country";--> statement-breakpoint
DROP INDEX "job_listings_stateAbbreviation_index";--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "imageUrl" SET DEFAULT '';--> statement-breakpoint
UPDATE "organizations" SET "imageUrl" = '' WHERE "imageUrl" IS NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "imageUrl" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "job_listings_country_index" ON "job_listings" USING btree ("country");
