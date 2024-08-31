DO $$ BEGIN
 CREATE TYPE "public"."license_key_status" AS ENUM('inactive', 'active');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sepay_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"gateway" text,
	"transaction_date" text,
	"account_number" text,
	"code" text,
	"content" text,
	"transfer_type" text,
	"transfer_amount" integer,
	"accumulated" integer,
	"sub_account" text,
	"reference_code" text,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"license_key_status" "license_key_status" DEFAULT 'inactive'
);
