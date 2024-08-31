import type { SEpayTransaction } from "~/lib/sepay-transactions";

import { database } from "~/lib/database";
import { sepayTransactions } from "~/lib/schema";

export async function POST(request: Request): Promise<Response> {
  const secretHeader = request.headers.get("Authorization");

  if (secretHeader !== `Apikey ${process.env.SEPAY_WEBHOOK_SECRET}`)
    return Response.json({ error: "Invalid signature" }, { status: 401 });

  const rawData = await request.text();
  const data = JSON.parse(rawData) as SEpayTransaction;

  if (data.transferAmount !== Number(process.env.NEXT_PUBLIC_SEPAY_AMOUNT))
    return Response.json({ error: "Invalid transaction" }, { status: 400 });

  try {
    await database.insert(sepayTransactions).values(data).onConflictDoNothing();
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error saving transaction:", error);
    return Response.json(
      { error: "Failed to save transaction" },
      { status: 500 },
    );
  }
}
