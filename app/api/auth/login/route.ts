import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const VALID_USERS = [
      { user: "TrongPhuc", pass: "Phucntt12345@" },
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

    const token = jwt.sign(
      { username: isValid.user },
      SECRET,
      { expiresIn: "10y" }
    );

     const cookieStore = await cookies();

     cookieStore.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge:  60 * 60 * 24 * 365 * 10,
    });

    return NextResponse.json({
      message: "Đăng nhập thành công",
      user: { username: isValid.user }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
