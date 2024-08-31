"use server";

import { like } from "drizzle-orm";

import { database } from "~/lib/database";
import { sepayTransactions } from "~/lib/schema";

export async function checkSEPayTransactionSuccess(
  id: string,
): Promise<boolean> {
  try {
    const transactions = await database
      .select()
      .from(sepayTransactions)
      .where(like(sepayTransactions.description, `%${id}%`))
      .limit(1);

    return transactions.length > 0;
  } catch (error) {
    console.error("Error checking SEPay transaction:", error);
    return false;
  }
}
