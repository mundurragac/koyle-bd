"use server";

import { cookies } from "next/headers";

export async function entrar(clave: string) {
  if (!process.env.DASHBOARD_CLAVE || clave !== process.env.DASHBOARD_CLAVE) return false;

  (await cookies()).set("clave", clave, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90,
  });
  return true;
}
