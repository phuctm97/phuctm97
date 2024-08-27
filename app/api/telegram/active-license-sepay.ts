import type { Context } from "grammy";

import { kv } from "@vercel/kv";

export async function activeLicenseSEPay(
  context: Context,
  licenseKeyStatus: string,
  licenseKey: string,
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
  await kv.set(`license-${licenseKey}`, "active");
  await context.reply(
    `License key valid! Here is the invite link to our group: ${inviteLink.invite_link}`,
  );
}
