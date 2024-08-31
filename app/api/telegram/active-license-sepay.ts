import type { Context } from "grammy";

import { eq } from "drizzle-orm";

import { database } from "~/lib/database";
import { sepayTransactions } from "~/lib/schema";

export async function activeLicenseSEPay(
  context: Context,
  transactionId: number,
  licenseKeyStatus: string | undefined | null,
): Promise<void> {
  if (licenseKeyStatus === "active") {
    await context.reply("This license key has already been used");
    return;
  }
  const inviteLink = await context.api.createChatInviteLink(
    process.env.TELEGRAM_COMMUNITY_GROUP_ID,
    {
      expire_date: Math.floor(Date.now() / 1000) + 3600,
      member_limit: 1,
    },
  );
  await database
    .update(sepayTransactions)
    .set({ licenseKeyStatus: "active" })
    .where(eq(sepayTransactions.id, transactionId));
  await context.reply(
    `License key valid! Here is the invite link to our group: ${inviteLink.invite_link}`,
  );
}
