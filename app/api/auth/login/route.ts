import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const VALID_USERS = [
      { user: "TrongPhuc", pass: "Phucntt1234@" },
      { user: "KhaBaoDuyen", pass: "Duyenktb12345@" }
    ];

    const isValid = VALID_USERS.find(
      (u) => u.user === username && u.pass === password
    );

    if (!isValid) {
      return NextResponse.json(
        { message: "Thông tin đăng nhập không chính xác" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("auth_session", JSON.stringify({ username: isValid.user }), {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 10,
      sameSite: "lax",
    });

    return NextResponse.json({
      message: "Đăng nhập thành công",
      user: { username: isValid.user }
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi Server" },
      { status: 500 }
    );
  }
}