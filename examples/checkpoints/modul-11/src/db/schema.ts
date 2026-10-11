import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const suggestions = sqliteTable("book_suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  reason: text("reason").notNull(),
});
