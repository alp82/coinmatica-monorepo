// src/server/trpc/router/index.ts
import { t } from "../utils";
import { authRouter } from "./auth";
import { telegramRouter } from './telegram'
import { userSettingsRouter } from './userSettings'

export const appRouter = t.router({
  auth: authRouter,
  telegram: telegramRouter,
  userSettings: userSettingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
