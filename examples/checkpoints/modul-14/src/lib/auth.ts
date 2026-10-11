import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/db";
import * as authSchema from "@/db/auth-schema";
import { authOptions } from "./auth-options";

export const auth = betterAuth({
  ...authOptions,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: authSchema,
  }),
});
