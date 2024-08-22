"use server";

import {
  createCheckout,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import { redirect } from "next/navigation";

export async function buyLicense(): Promise<never> {
  lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY });

  const createCheckoutResult = await createCheckout(
    process.env.LEMON_SQUEEZY_STORE_ID,
    process.env.LEMON_SQUEEZY_ONE_TIME_VARIANT_ID,
    {
      productOptions: {
        redirectUrl: `https://t.me/${process.env.TELEGRAM_BOT_ID}`,
        receiptLinkUrl: `https://t.me/${process.env.TELEGRAM_BOT_ID}`,
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
