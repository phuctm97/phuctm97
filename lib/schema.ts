import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const licenseKeyStatusEnum = pgEnum("license_key_status", [
  "inactive",
  "active",
]);

export const sepayTransactions = pgTable("sepay_transactions", {
  id: serial("id").primaryKey(),
  gateway: text("gateway"),
  transactionDate: text("transaction_date"),
  accountNumber: text("account_number"),
  code: text("code"),
  content: text("content"),
  transferType: text("transfer_type"),
  transferAmount: integer("transfer_amount"),
  accumulated: integer("accumulated"),
  subAccount: text("sub_account"),
  referenceCode: text("reference_code"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  licenseKeyStatus:
    licenseKeyStatusEnum("license_key_status").default("inactive"),
});
