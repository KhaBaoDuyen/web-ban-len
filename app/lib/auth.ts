import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export type AuthPayload = {
  username: string;
  iat: number;
  exp: number;
};

 export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, SECRET) as AuthPayload;
  } catch (err) {
    return null;
  }
}

 