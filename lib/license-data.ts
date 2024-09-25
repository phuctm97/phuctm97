import { z } from "zod";

export const LicenseData = z.object({
  code: z.string(),
  sepayId: z.number(),
  amount: z.number(),
  activated: z.boolean(),
});

export type LicenseData = z.infer<typeof LicenseData>;
