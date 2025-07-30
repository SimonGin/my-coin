import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.split(" ")[1];
  return jwt.verify(token, "my-coin-jwt-secret") as { address: string };
}
