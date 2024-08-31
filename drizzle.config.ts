import type { Config } from "drizzle-kit";

import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
} satisfies Config;
