import type { z } from "zod";

import { createInsertSchema } from "drizzle-zod";

import { sepayTransactions } from "~/lib/schema";

const insertSEpayTransactionSchema = createInsertSchema(sepayTransactions);

export type SEpayTransaction = z.infer<typeof insertSEpayTransactionSchema>;
