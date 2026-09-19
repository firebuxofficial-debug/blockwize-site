import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { ADMIN_SESSION_COOKIE, createAdminSession } from "./adminAuth";

function createContext(cookieHeader?: string) {
  const cookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: cookieHeader ? { cookie: cookieHeader } : {} } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        cookies.push({ name, value, options });
      },
      clearCookie: () => undefined,
    } as TrpcContext["res"],
  };
  return { ctx, cookies };
}

describe("admin login", () => {
  it("accepts the configured secret credentials and creates a secure session cookie", async () => {
    expect(process.env.ADMIN_EMAIL).toBeTruthy();
    expect(process.env.ADMIN_PASSWORD).toBeTruthy();

    const { ctx, cookies } = createContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.login({
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
    });

    expect(result).toEqual({ success: true });
    expect(cookies[0]?.name).toBe(ADMIN_SESSION_COOKIE);
    expect(cookies[0]?.options).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax" });
  });

  it("rejects invalid credentials", async () => {
    const { ctx } = createContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.login({ email: "wrong@example.com", password: "wrong-password" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("recognizes a valid administrative session and blocks metrics without one", async () => {
    const anonymous = createContext();
    await expect(appRouter.createCaller(anonymous.ctx).adminDashboard.metrics()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });

    const sessionToken = await createAdminSession();
    const authenticated = createContext(`${ADMIN_SESSION_COOKIE}=${sessionToken}`);
    await expect(appRouter.createCaller(authenticated.ctx).admin.session()).resolves.toEqual({ authenticated: true });
  });
});
