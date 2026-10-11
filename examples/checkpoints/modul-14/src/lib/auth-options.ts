import type { BetterAuthOptions } from "better-auth";

export const authOptions = {
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 15,
  },
  session: {
    cookieCache: { enabled: false },
  },
} satisfies BetterAuthOptions;
