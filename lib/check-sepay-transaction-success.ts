"use server";

import type { LicenseData } from "~/lib/license-data";

import { kv } from "@vercel/kv";

export async function checkSEPayTransactionSuccess(
  code: string,
): Promise<boolean> {
  const key = `license:${code}`;
  const licenseData = await kv.get<LicenseData>(key);

  if (!licenseData) return false;

  return licenseData.amount === Number(process.env.NEXT_PUBLIC_SEPAY_AMOUNT);
}
