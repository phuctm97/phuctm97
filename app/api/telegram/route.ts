import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { Bot, webhookCallback } from "grammy";

import { decodeEmailURL } from "~/lib/decode-email-url";

import { activeLicense } from "./active-license";
import { findInactiveLicense } from "./find-inactive-license";

const bot = new Bot(process.env.TELEGRAM_COMMUNITY_BOT_TOKEN);
lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY });

function validateEmail(email: string): boolean {
  const re = /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/;
  return re.test(email);
}

bot.command("start", async (context) => {
  const email = decodeEmailURL(context.match);

  if (!validateEmail(email)) {
    await context.reply(
      "Welcome to the P Community Bot! Please enter your license key",
    );
    return;
  }

  try {
    const inactiveLicense = await findInactiveLicense(email);
    await (inactiveLicense
      ? activeLicense(context, inactiveLicense)
      : context.reply(
          "Welcome to the P Community Bot! Please enter your license key",
        ));
  } catch (error) {
    console.error("Error in start command:", error);
    await context.reply(
      "Welcome to the P Community Bot! Please enter your license key",
    );
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
