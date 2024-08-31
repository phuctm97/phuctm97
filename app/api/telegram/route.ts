import type { Context } from "grammy";

import {
  lemonSqueezySetup,
  validateLicense,
} from "@lemonsqueezy/lemonsqueezy.js";
import { eq } from "drizzle-orm";
import { Bot, webhookCallback } from "grammy";

import { database } from "~/lib/database";
import { communityLicense } from "~/lib/schema";

import { activeLicenseLemonsquezzy } from "./active-license-lemonsquezzy";
import { activeLicenseSEPay } from "./active-license-sepay";

const bot = new Bot(process.env.TELEGRAM_COMMUNITY_BOT_TOKEN);
lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY });

const sendWelcomeMessage = async (context: Context): Promise<void> => {
  await context.reply(
    "Welcome to the P Community Bot! Please enter your license key",
  );
};

const handleLicense = async (
  context: Context,
  licenseKey: string,
): Promise<void> => {
  const validatedLicense = await validateLicense(licenseKey);

  if (!validatedLicense.data?.valid) {
    const licenseStatus = await database
      .select()
      .from(communityLicense)
      .where(eq(communityLicense.code, licenseKey));
    if (licenseStatus.length === 0) {
      await context.reply("License key is invalid. Please try again.");
      return;
    }
    await activeLicenseSEPay(
      context,
      licenseStatus[0].code,
      licenseStatus[0].activated,
    );
    return;
  }

  try {
    await activeLicenseLemonsquezzy(context, licenseKey);
  } catch (error) {
    await context.reply((error as Error).message);
  }
};

bot.command("start", async (context) => {
  if (!context.match) {
    await sendWelcomeMessage(context);
    return;
  }
  await handleLicense(context, context.match);
});

bot.on("message:text", async (context) => {
  if (
    context.message.chat.id === Number(process.env.TELEGRAM_COMMUNITY_GROUP_ID)
  )
    return;
  await handleLicense(context, context.message.text.trim());
});

export const POST = webhookCallback(bot, "std/http", {
  secretToken: process.env.TELEGRAM_COMMUNITY_WEBHOOK_SECRET_TOKEN,
});
