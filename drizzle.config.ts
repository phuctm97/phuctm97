import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(".");

export default defineConfig({
  dbCredentials: { url: process.env.POSTGRES_URL },
  dialect: "postgresql",
  schema: "./lib/schema.ts",
});
