"use server";

import { kv } from "@vercel/kv";
import { redirect } from "next/navigation";

export async function addLicenseToKVRedirectTelegram(
  licenseKey: string,
): Promise<void> {
  await kv.set(`license-${licenseKey}`, "inactive");
  redirect(
    `https://t.me/${process.env.TELEGRAM_COMMUNITY_BOT_ID}?start=${licenseKey}`,
  );
}
