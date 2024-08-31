"use server";

import { like } from "drizzle-orm";

import { database } from "~/lib/database";
import { communityLicense } from "~/lib/schema";

export async function checkSEPayTransactionSuccess(
  code: string,
): Promise<boolean> {
  try {
    const transactions = await database
      .select()
      .from(communityLicense)
      .where(like(communityLicense.code, `%${code}%`))
      .limit(1);

    return transactions.length > 0;
  } catch (error) {
    console.error("Error checking SEPay transaction:", error);
    return false;
  }
}
