import { kv } from "@vercel/kv";

import { LicenseDataSchema } from "~/lib/license-data";

interface Transaction {
  id: number;
  code: string;
  transferAmount: number;
}

export async function POST(request: Request): Promise<Response> {
  const secretHeader = request.headers.get("Authorization");

  if (secretHeader !== `Apikey ${process.env.SEPAY_WEBHOOK_SECRET}`)
    return Response.json({ error: "Invalid signature" }, { status: 401 });

  const data = (await request.json()) as Transaction;

  if (
    !data.code ||
    data.transferAmount !== Number(process.env.NEXT_PUBLIC_SEPAY_AMOUNT)
  )
    return Response.json({ error: "Invalid transaction" }, { status: 400 });

  try {
    const key = `license:${data.code}`;
    const existingLicense = await kv.get(key);
    if (!existingLicense) {
      const licenseData = LicenseDataSchema.parse({
        code: data.code,
        sepayId: data.id,
        amount: data.transferAmount,
        activated: false,
      });
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
