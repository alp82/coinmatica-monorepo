import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "../../../env/server.mjs";
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { getConnectionPromise } from '../../../server/db/mongo_client'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(getConnectionPromise()),
  // Include user.id on session
  callbacks: {
    jwt: ({token,user, account, profile}) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({session, user}) => {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
