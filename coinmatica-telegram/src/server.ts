/* eslint-disable @typescript-eslint/ban-types */
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import * as trpc from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { z } from 'zod';

import { startTelegramClients } from './telegram-client/init'
import { watchTelegramClientInfo } from './telegram-client/watch'


// telegram

startTelegramClients()
watchTelegramClientInfo()

// trpc

type Context = {};

export const appRouter = trpc
  .router<Context>()
  .query('hello', {
    input: z
      .object({
        name: z.string(),
      })
      .nullish(),
    resolve: ({ input }) => {
      return {
        text: `hello ${input?.name ?? 'world'}`,
      };
    },
  })
  .mutation('createPost', {
    input: z.object({
      title: z.string(),
      text: z.string(),
    }),
    resolve({ input }) {
      // imagine db call here
      return {
        id: `${Math.random()}`,
        ...input,
      };
    },
  })

export type AppRouter = typeof appRouter;

// http server
const { server, listen } = createHTTPServer({
  router: appRouter,
  createContext() {
    return {};
  },
});

listen(3100);
