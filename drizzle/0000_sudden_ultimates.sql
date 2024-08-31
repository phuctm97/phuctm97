CREATE TABLE IF NOT EXISTS "community_license" (
	"code" text PRIMARY KEY NOT NULL,
	"sepayId" integer,
	"amount" integer,
	"activated" boolean DEFAULT false
);
