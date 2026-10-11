import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function getVerifiedSession() {
  return auth.api.getSession({ headers: await headers() });
}
