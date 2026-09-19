import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  getAdminCookieOptions,
  isConfiguredAdmin,
  isValidAdminSession,
  readAdminSessionCookie,
} from "./adminAuth";
import {
  getAdminMetrics,
  getAdminRobloxProfiles,
  getCommunityLinks,
  recordQuizCompletion,
  recordSiteVisit,
  updateCommunityLinks,
  updateRobloxAvatarUrl,
  updateRobloxRewardProgress,
  upsertRobloxProfile,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getRobloxAvatarUrl, lookupRobloxProfile, RobloxProfileError } from "./robloxProfile";

const visitorInput = z.object({
  visitorId: z.string().uuid(),
  locale: z.enum(["en", "pt"]),
});

const communityLinksInput = z.object({
  discordUrl: z.string().url().refine(url => /^https:\/\//.test(url), "Use an HTTPS link"),
  robloxGroupUrl: z.string().url().refine(url => /^https:\/\//.test(url), "Use an HTTPS link"),
});

const adminSessionProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const token = readAdminSessionCookie(ctx.req.headers.cookie);
  if (!(await isValidAdminSession(token))) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Administrator session required" });
  }
  return next();
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        if (!isConfiguredAdmin(input.email, input.password)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid administrator credentials" });
        }
        const token = await createAdminSession();
        ctx.res.cookie(ADMIN_SESSION_COOKIE, token, getAdminCookieOptions(ctx.req));
        return { success: true } as const;
      }),
    session: publicProcedure.query(async ({ ctx }) => ({
      authenticated: await isValidAdminSession(readAdminSessionCookie(ctx.req.headers.cookie)),
    })),
    logout: publicProcedure.mutation(({ ctx }) => {
      const { maxAge: _maxAge, ...cookieOptions } = getAdminCookieOptions(ctx.req);
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, cookieOptions);
      return { success: true } as const;
    }),
  }),

  publicConfig: router({
    communityLinks: publicProcedure.query(async () => getCommunityLinks()),
  }),

  analytics: router({
    visit: publicProcedure.input(visitorInput).mutation(async ({ input }) => ({
      recorded: await recordSiteVisit(input),
    })),
    quizCompleted: publicProcedure
      .input(visitorInput.extend({ score: z.number().int().min(0).max(5) }))
      .mutation(async ({ input }) => ({
        recorded: await recordQuizCompletion(input),
      })),
    profileConfirmed: publicProcedure
      .input(
        visitorInput.extend({
          robloxUserId: z.number().int().positive(),
          username: z.string().trim().min(3).max(20).regex(/^[A-Za-z0-9_]+$/),
          displayName: z.string().min(1).max(64).optional(),
          avatarUrl: z.string().url().nullable().optional(),
          rewardPreference: z.union([z.literal(500), z.literal(1000)]),
        }),
      )
      .mutation(async ({ input }) => {
        let profile;
        try {
          profile = await lookupRobloxProfile(input.username);
        } catch {
          throw new TRPCError({ code: "BAD_GATEWAY", message: "Roblox profile validation is unavailable" });
        }
        if (profile.id !== input.robloxUserId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Roblox profile does not match the selected account" });
        }
        return {
          recorded: await upsertRobloxProfile({
            visitorId: input.visitorId,
            locale: input.locale,
            robloxUserId: profile.id,
            username: profile.name,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            rewardPreference: input.rewardPreference,
          }),
        };
      }),
    rewardProgress: publicProcedure
      .input(
        z.object({
          visitorId: z.string().uuid(),
          robloxUserId: z.number().int().positive(),
          deliveryMethod: z.enum(["plus", "group"]).optional(),
          rewardStatus: z.enum(["delivery_selected", "community_step"]),
        }),
      )
      .mutation(async ({ input }) => ({
        recorded: await updateRobloxRewardProgress(input),
      })),
  }),

  adminDashboard: router({
    metrics: adminSessionProcedure.query(async () => getAdminMetrics()),
    robloxProfiles: adminSessionProcedure.query(async () => {
      const profiles = await getAdminRobloxProfiles();
      return Promise.all(
        profiles.map(async profile => {
          if (profile.avatarUrl) return profile;
          const avatarUrl = await getRobloxAvatarUrl(profile.robloxUserId);
          await updateRobloxAvatarUrl(profile.robloxUserId, avatarUrl);
          return { ...profile, avatarUrl };
        }),
      );
    }),
    communityLinks: adminSessionProcedure.query(async () => getCommunityLinks()),
    updateCommunityLinks: adminSessionProcedure
      .input(communityLinksInput)
      .mutation(async ({ input }) => ({ saved: await updateCommunityLinks(input) })),
  }),

  roblox: router({
    lookup: publicProcedure
      .input(z.object({ username: z.string().trim().min(3).max(20).regex(/^[A-Za-z0-9_]+$/) }))
      .mutation(async ({ input }) => {
        try {
          return await lookupRobloxProfile(input.username);
        } catch (error) {
          if (error instanceof RobloxProfileError && error.kind === "not_found") {
            throw new TRPCError({ code: "NOT_FOUND", message: "Roblox username not found" });
          }
          throw new TRPCError({ code: "BAD_GATEWAY", message: "Roblox is unavailable right now" });
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
