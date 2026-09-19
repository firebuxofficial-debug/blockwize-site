import { timingSafeEqual, createHmac } from "node:crypto";
import { parse } from "cookie";
import { jwtVerify, SignJWT } from "jose";
import type { Request } from "express";
import fs from "fs";
import path from "path";

export const ADMIN_SESSION_COOKIE = "blockwise_admin_session";
const ADMIN_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

// Load configuration from environment, but allow a local fallback file for
// situations where env vars cannot be set (development or temporary fix).
const LOCAL_CREDENTIALS_PATH = path.resolve(process.cwd(), "server", "admin-credentials.local.json");

const CONFIG: { ADMIN_EMAIL?: string; ADMIN_PASSWORD?: string; JWT_SECRET?: string } = {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
};

try {
  if ((!CONFIG.ADMIN_EMAIL || !CONFIG.ADMIN_PASSWORD || !CONFIG.JWT_SECRET) && fs.existsSync(LOCAL_CREDENTIALS_PATH)) {
    const raw = fs.readFileSync(LOCAL_CREDENTIALS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    CONFIG.ADMIN_EMAIL = CONFIG.ADMIN_EMAIL ?? parsed.ADMIN_EMAIL;
    CONFIG.ADMIN_PASSWORD = CONFIG.ADMIN_PASSWORD ?? parsed.ADMIN_PASSWORD;
    CONFIG.JWT_SECRET = CONFIG.JWT_SECRET ?? parsed.JWT_SECRET;
  }
} catch (err) {
  // ignore parse/read errors — we'll fall back to env-only behavior
}

function getSessionKey() {
  const secret = CONFIG.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required for admin sessions");
  return new TextEncoder().encode(secret);
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function hmacEqual(left: string, right: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) return safeEqual(left, right);
  const h1 = createHmac("sha256", secret).update(left).digest();
  const h2 = createHmac("sha256", secret).update(right).digest();
  return timingSafeEqual(h1, h2);
}

export function isConfiguredAdmin(email: string, password: string) {
  const configuredEmail = CONFIG.ADMIN_EMAIL;
  const configuredPassword = CONFIG.ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword) return false;

  const normalizedInputEmail = String(email).trim().toLowerCase();
  const normalizedConfiguredEmail = String(configuredEmail).trim().toLowerCase();
  const normalizedInputPassword = String(password).trim();
  const normalizedConfiguredPassword = String(configuredPassword).trim();

  return hmacEqual(normalizedInputEmail, normalizedConfiguredEmail) && hmacEqual(normalizedInputPassword, normalizedConfiguredPassword);
}

export async function createAdminSession() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("blockwise-admin")
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSessionKey());
}

export async function isValidAdminSession(token: string | undefined) {
  if (!token) return false;
  try {
    const verified = await jwtVerify(token, getSessionKey());
    return verified.payload.sub === "blockwise-admin" && verified.payload.role === "admin";
  } catch {
    return false;
  }
}

export function readAdminSessionCookie(cookieHeader: string | undefined) {
  return parse(cookieHeader ?? "")[ADMIN_SESSION_COOKIE];
}

export function getAdminCookieOptions(req: Request) {
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  const isSecure = req.protocol === "https" || forwardedProtocol === "https";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isSecure,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_MS,
  };
}
