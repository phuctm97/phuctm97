"use server";

import {
  createCheckout,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import { redirect } from "next/navigation";

export async function buyLicense(): Promise<never> {
  lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY });

  const telegramDeepLink = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_COMMUNITY_BOT_ID}?start=[license_key]`;

  const createCheckoutResult = await createCheckout(
    process.env.LEMON_SQUEEZY_STORE_ID,
    process.env.LEMON_SQUEEZY_COMMUNITY_MEMBERSHIP_VARIANT_ID,
    {
      productOptions: {
        redirectUrl: telegramDeepLink,
        receiptLinkUrl: telegramDeepLink,
      },
    },
  );

  if (!createCheckoutResult.data) {
    throw new Error("Failed to create checkout", {
      cause: createCheckoutResult.error,
    });
  }

  const { data: checkout } = createCheckoutResult;
  redirect(checkout.data.attributes.url);
}
