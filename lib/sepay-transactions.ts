import type { z } from "zod";

import { createInsertSchema } from "drizzle-zod";

import { communityLicense } from "~/lib/schema";

const insertCommunityLicenseSchema = createInsertSchema(communityLicense);

export type CommunityLicense = z.infer<typeof insertCommunityLicenseSchema>;
