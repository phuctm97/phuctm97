"use server";

interface Transaction {
  transaction_content: string;
}

interface ApiResponse {
  transactions: Transaction[];
}

export async function checkSEPayTransactionSuccess(
  id: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      "https://my.sepay.vn/userapi/transactions/list?limit=5",
      {
        headers: {
          Authorization: `Bearer ${process.env.SEPAY_API_TOKEN}`,
        },
      },
    );

    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status.toString()}`);

    const data: ApiResponse = (await response.json()) as ApiResponse;
    const transactions = data.transactions;

    return transactions.some((transaction) =>
      transaction.transaction_content.includes(id),
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return false;
  }
}
