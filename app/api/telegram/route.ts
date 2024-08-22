import type { Update } from "grammy/types";

import { activateLicense } from "@lemonsqueezy/lemonsqueezy.js";
import { Bot } from "grammy";
import { NextResponse } from "next/server";

import { getCurrentURL } from "~/lib/config";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

const secretToken = process.env.TELEGRAM_SECRET_TOKEN;
const webhookUrl = getCurrentURL("/api/telegram").toString();

bot.command("start", async (context) => {
  await context.reply(
    "Welcome to the P Community Bot! Please enter your license key",
  );
});

bot.on("message:text", async (context) => {
  const licenseKey = context.message.text.trim();

  try {
    const { data } = await activateLicense(licenseKey, "Telegram Bot");

    if (
      data?.error?.includes(
        "This license key has reached the activation limit.",
      )
    ) {
      await context.reply("This license key used already");
      return;
    }

    if (data && data.activated) {
      try {
        const inviteLink = await context.api.createChatInviteLink(
          process.env.TELEGRAM_GROUP_ID,
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
  } catch (error) {
    console.error("Error activating license:", error);
    await context.reply(
      "An error occurred while processing the license key. Please try again.",
    );
  }
});

export async function POST(request: Request): Promise<Response> {
  const update = (await request.json()) as Update;

  await bot.init();

  await bot.handleUpdate(update);

  return NextResponse.json({ ok: true });
}

await bot.api
  .setWebhook(webhookUrl, {
    secret_token: secretToken,
  })
  .catch((error: unknown) => {
    console.error("Error setting webhook:", error);
  });
