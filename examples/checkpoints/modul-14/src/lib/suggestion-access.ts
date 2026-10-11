import "server-only";
import { auth } from "./auth";

export async function requireSuggestionSession(request: Request) {
  if (request.method !== "GET") {
    const origin = process.env.BETTER_AUTH_URL;
    if (!origin) throw new Error("BETTER_AUTH_URL belum diisi.");
    if (request.headers.get("origin") !== origin) {
      return Response.json({ error: "Origin ditolak." }, { status: 403 });
    }
  }
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: "Silakan masuk kembali." }, { status: 401 });
  }
  return session;
}
