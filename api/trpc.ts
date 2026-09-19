import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
});

export default function handler(req: Parameters<typeof trpcMiddleware>[0], res: Parameters<typeof trpcMiddleware>[1]) {
  return trpcMiddleware(req, res, error => {
    if (error) {
      console.error("[tRPC] Request failed", error);
      if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
    }
  });
}