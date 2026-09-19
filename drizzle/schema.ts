import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const siteVisits = mysqlTable("siteVisits", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  locale: varchar("locale", { length: 8 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const quizAttempts = mysqlTable("quizAttempts", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  locale: varchar("locale", { length: 8 }).notNull(),
  score: int("score").notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export const robloxProfiles = mysqlTable(
  "robloxProfiles",
  {
    id: int("id").autoincrement().primaryKey(),
    visitorId: varchar("visitorId", { length: 64 }).notNull(),
    robloxUserId: int("robloxUserId").notNull(),
    username: varchar("username", { length: 32 }).notNull(),
    displayName: varchar("displayName", { length: 64 }).notNull(),
    avatarUrl: text("avatarUrl"),
    locale: varchar("locale", { length: 8 }).notNull(),
    rewardPreference: int("rewardPreference").notNull(),
    deliveryMethod: varchar("deliveryMethod", { length: 16 }),
    rewardStatus: varchar("rewardStatus", { length: 32 }).default("profile_confirmed").notNull(),
    confirmedAt: timestamp("confirmedAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("robloxProfiles_robloxUserId_unique").on(table.robloxUserId)],
);

export type RobloxProfileRecord = typeof robloxProfiles.$inferSelect;

export const siteSettings = mysqlTable("siteSettings", {
  settingKey: varchar("settingKey", { length: 64 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
