import type { NextRequest } from "next/server";

// En Vercel el proxy corre antes de la CDN, así que la respuesta cacheada del GET nunca llega sin clave.
export function proxy(request: NextRequest) {
  const clave = process.env.DASHBOARD_CLAVE;
  if (request.method === "GET" && (!clave || request.cookies.get("clave")?.value !== clave)) {
    return Response.json({ error: "Clave inválida" }, { status: 401 });
  }
}

export const config = { matcher: "/api/rsvp" };
