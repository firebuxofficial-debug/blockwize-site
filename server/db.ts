import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  quizAttempts,
  robloxProfiles,
  siteSettings,
  siteVisits,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function recordSiteVisit(input: { visitorId: string; locale: string }) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(siteVisits).values(input);
  return true;
}

export async function recordQuizCompletion(input: { visitorId: string; locale: string; score: number }) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(quizAttempts).values(input);
  return true;
}

export async function upsertRobloxProfile(input: {
  visitorId: string;
  robloxUserId: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  locale: string;
  rewardPreference: number;
}) {
  const db = await getDb();
  if (!db) return false;
  await db.insert(robloxProfiles).values(input).onDuplicateKeyUpdate({
    set: {
      visitorId: input.visitorId,
      username: input.username,
      displayName: input.displayName,
      avatarUrl: input.avatarUrl,
      locale: input.locale,
      rewardPreference: input.rewardPreference,
      deliveryMethod: null,
      rewardStatus: "profile_confirmed",
      confirmedAt: new Date(),
    },
  });
  return true;
}

export async function updateRobloxRewardProgress(input: {
  visitorId: string;
  robloxUserId: number;
  deliveryMethod?: "plus" | "group";
  rewardStatus: "delivery_selected" | "community_step";
}) {
  const db = await getDb();
  if (!db) return false;
  await db
    .update(robloxProfiles)
    .set({
      deliveryMethod: input.deliveryMethod,
      rewardStatus: input.rewardStatus,
    })
    .where(and(eq(robloxProfiles.robloxUserId, input.robloxUserId), eq(robloxProfiles.visitorId, input.visitorId)));
  return true;
}

export async function getAdminMetrics() {
  const db = await getDb();
  if (!db) {
    return { totalVisits: 0, uniqueVisitors: 0, quizCompletions: 0, perfectScores: 0, robloxProfiles: 0 };
  }

  const [visitMetrics] = await db
    .select({
      totalVisits: count(),
      uniqueVisitors: sql<number>`count(distinct ${siteVisits.visitorId})`,
    })
    .from(siteVisits);
  const [quizMetrics] = await db
    .select({
      quizCompletions: count(),
      perfectScores: sql<number>`sum(case when ${quizAttempts.score} = 5 then 1 else 0 end)`,
    })
    .from(quizAttempts);
  const [profileMetrics] = await db.select({ robloxProfiles: count() }).from(robloxProfiles);

  return {
    totalVisits: Number(visitMetrics?.totalVisits ?? 0),
    uniqueVisitors: Number(visitMetrics?.uniqueVisitors ?? 0),
    quizCompletions: Number(quizMetrics?.quizCompletions ?? 0),
    perfectScores: Number(quizMetrics?.perfectScores ?? 0),
    robloxProfiles: Number(profileMetrics?.robloxProfiles ?? 0),
  };
}

export async function getAdminRobloxProfiles(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(robloxProfiles).orderBy(desc(robloxProfiles.updatedAt)).limit(limit);
}

export const DEFAULT_COMMUNITY_LINKS = {
  discordUrl: "https://discord.gg/AGCewwpPDC",
  robloxGroupUrl: "https://rblx.pk/gfR-67LI",
} as const;

export type CommunityLinks = {
  discordUrl: string;
  robloxGroupUrl: string;
};

export async function getCommunityLinks(): Promise<CommunityLinks> {
  const db = await getDb();
  if (!db) return DEFAULT_COMMUNITY_LINKS;

  const settings = await db
    .select()
    .from(siteSettings)
    .where(inArray(siteSettings.settingKey, ["discordUrl", "robloxGroupUrl"]));
  const values = new Map(settings.map(setting => [setting.settingKey, setting.value]));

  return {
    discordUrl: values.get("discordUrl") || DEFAULT_COMMUNITY_LINKS.discordUrl,
    robloxGroupUrl: values.get("robloxGroupUrl") || DEFAULT_COMMUNITY_LINKS.robloxGroupUrl,
  };
}

export async function updateCommunityLinks(input: CommunityLinks) {
  const db = await getDb();
  if (!db) return false;

  await Promise.all(
    Object.entries(input).map(([settingKey, value]) =>
      db
        .insert(siteSettings)
        .values({ settingKey, value })
        .onDuplicateKeyUpdate({ set: { value, updatedAt: new Date() } }),
    ),
  );
  return true;
}

export async function updateRobloxAvatarUrl(robloxUserId: number, avatarUrl: string) {
  const db = await getDb();
  if (!db) return false;
  await db.update(robloxProfiles).set({ avatarUrl }).where(eq(robloxProfiles.robloxUserId, robloxUserId));
  return true;
}
