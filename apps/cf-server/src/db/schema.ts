import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { desc, sql } from "drizzle-orm";

export const portfolio_consultation_scheduling = sqliteTable(
  "portfolio_consultation_scheduling",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull(),

    company: text("company").notNull(),
    role: text("role").notNull(),

    about: text("about").notNull(),
    goals: text("goals").notNull(),

    preferredDateTime: text("preferred_date_time").notNull(),
    timezone: text("timezone"),

    scheduledAt: text("scheduled_at"),
    meetingLink: text("meeting_link"),

    status: text("status").notNull().default("new"),
    source: text("source"),

    subscribed: integer("subscribed", { mode: "boolean" })
      .notNull()
      .default(true),

    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
  }
);
