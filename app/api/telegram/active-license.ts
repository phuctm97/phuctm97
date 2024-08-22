import type { Context } from "grammy";

import { activateLicense } from "@lemonsqueezy/lemonsqueezy.js";

export async function activeLicense(
  context: Context,
  licenseKey: string,
): Promise<void> {
  const response = await activateLicense(licenseKey, "Community Lifetime");

  if (typeof response !== "object" || !("data" in response))
    throw new Error("Unexpected response format from activateLicense");

  const { data } = response;

  if (
    data?.error?.includes("This license key has reached the activation limit.")
  ) {
    await context.reply("This license key has already been used");
    return;
  }

  if (data?.activated) {
    const inviteLink = await context.api.createChatInviteLink(
      process.env.TELEGRAM_COMMUNITY_GROUP_ID,
      {
        expire_date: Math.floor(Date.now() / 1000) + 3600,
        member_limit: 1,
      },
    );
    await context.reply(
      `License key valid! Here is the invite link to our group: ${inviteLink.invite_link}`,
    );
  } else {
    await context.reply("License key is invalid. Please try again.");
  }
}
