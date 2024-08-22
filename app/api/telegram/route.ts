import { activateLicense } from "@lemonsqueezy/lemonsqueezy.js";
import { Bot, webhookCallback } from "grammy";

const bot = new Bot(process.env.TELEGRAM_COMMUNITY_BOT_TOKEN);

bot.command("start", async (context) => {
  await context.reply(
    "Welcome to the P Community Bot! Please enter your license key",
  );
});

bot.on("message:text", async (context) => {
  const licenseKey = context.message.text.trim();

  try {
    const response = await activateLicense(licenseKey, "Telegram Bot");

    if (typeof response === "object" && "data" in response) {
      const { data } = response;

      if (
        data?.error?.includes(
          "This license key has reached the activation limit.",
        )
      ) {
        await context.reply("This license key has already been used");
        return;
      }

      if (data && data.activated) {
        try {
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
        } catch (inviteError) {
          console.error("Error creating invite link:", inviteError);
          await context.reply(
            "License key is valid, but there was an issue creating the invite link. Please contact support.",
          );
        }
      } else {
        await context.reply("License key is invalid. Please try again.");
      }
    } else {
      throw new Error("Unexpected response format from activateLicense");
    }
  } catch (error) {
    console.error("Error activating license:", error);
    await context.reply(
      "An error occurred while processing the license key. Please try again.",
    );
  }
});

export const POST = webhookCallback(bot, "std/http", {
  secretToken: process.env.TELEGRAM_COMMUNITY_WEBHOOK_SECRET_TOKEN,
});
