import type { VercelRequest, VercelResponse } from "@vercel/node";

function maskEmail(email: string) {
  try {
    const [local, domain] = email.split("@");
    if (!domain) return "***@***";
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
  } catch {
    return "***@***";
  }
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const hasEmail = !!process.env.ADMIN_EMAIL;
  const hasPassword = !!process.env.ADMIN_PASSWORD;
  const hasJwt = !!process.env.JWT_SECRET;
  res.status(200).json({
    configured: hasEmail && hasPassword && hasJwt,
    adminEmail: hasEmail ? maskEmail(process.env.ADMIN_EMAIL as string) : null,
    hasPassword: hasPassword,
    hasJwt: hasJwt,
    note: "This endpoint only reveals presence of configuration and a masked admin email. It does NOT expose secrets.",
  });
}
