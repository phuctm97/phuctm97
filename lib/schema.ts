import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";

export const communityLicense = pgTable("community_license", {
  code: text("code").primaryKey(),
  sepayId: integer("sepayId"),
  amount: integer("amount"),
  activated: boolean("activated").default(false),
});
