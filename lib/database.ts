import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "~/lib/schema";

export const database = drizzle(sql, { schema });
