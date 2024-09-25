import type { LicenseData } from "~/lib/license-data";

import { kv } from "@vercel/kv";
import { z } from "zod";

const Transaction = z.object({
  id: z.number(),
  code: z.string(),
  transferAmount: z.number(),
});

export async function POST(request: Request): Promise<Response> {
  const secretHeader = request.headers.get("Authorization");

  if (secretHeader !== `Apikey ${process.env.SEPAY_WEBHOOK_SECRET}`)
    return Response.json({ error: "Invalid signature" }, { status: 401 });

  const data = Transaction.parse(await request.json());

  if (
    !data.code ||
    data.transferAmount !== Number(process.env.NEXT_PUBLIC_SEPAY_AMOUNT)
  )
    return Response.json({ error: "Invalid transaction" }, { status: 400 });

  try {
    const key = `license:${data.code}`;
    const existingLicense = await kv.get<LicenseData>(key);
    if (!existingLicense) {
      const licenseData: LicenseData = {
        code: data.code,
        sepayId: data.id,
        amount: data.transferAmount,
        activated: false,
      };
      await kv.set(key, licenseData);
    }
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error saving transaction:", error);
    return Response.json(
      { error: "Failed to save transaction" },
      { status: 500 },
    );
  }
}
