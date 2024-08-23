import type { Context } from "grammy";

import {
  lemonSqueezySetup,
  validateLicense,
} from "@lemonsqueezy/lemonsqueezy.js";
import { Bot, webhookCallback } from "grammy";

import { activeLicense } from "./active-license";

const bot = new Bot(process.env.TELEGRAM_COMMUNITY_BOT_TOKEN);
lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY });

const sendWelcomeMessage = async (context: Context): Promise<void> => {
  await context.reply(
    "Welcome to the P Community Bot! Please enter your license key",
  );
};

bot.command("start", async (context) => {
  if (!context.match) {
    await sendWelcomeMessage(context);
    return;
  }

  const licenseKey = await validateLicense(context.match);

  if (!licenseKey.data?.valid) {
    await sendWelcomeMessage(context);
    return;
  }

  try {
    await activeLicense(context, context.match);
  } catch (error) {
    console.error("Error in start command:", error);
    await sendWelcomeMessage(context);
  }
});

bot.on("message:text", async (context) => {
  const licenseKey = context.message.text.trim();

  try {
    await activeLicense(context, licenseKey);
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
