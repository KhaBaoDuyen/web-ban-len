import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session")?.value;

  if (!token) {
    return Response.json({ user: null }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }

  return Response.json({ user });
}
