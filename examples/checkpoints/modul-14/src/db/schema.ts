import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const suggestions = sqliteTable("book_suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  reason: text("reason").notNull(),
  userId: text("user_id").references(() => user.id),
});

export const suggestionFields = {
  id: suggestions.id,
  title: suggestions.title,
  reason: suggestions.reason,
};
