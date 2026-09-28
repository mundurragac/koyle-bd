import { esAlojamiento, esAsistencia, type Rsvp } from "@/lib/rsvp";
import { agregarRsvp, obtenerRsvps } from "@/lib/sheets";

export async function GET() {
  return Response.json(await obtenerRsvps());
}

export async function POST(request: Request) {
  const rsvp = validar(await request.json().catch(() => null));
  if (!rsvp) return Response.json({ error: "Datos inválidos" }, { status: 400 });

  await agregarRsvp(rsvp);
  return Response.json({ ok: true }, { status: 201 });
}

function validar(body: unknown): Rsvp | null {
  if (typeof body !== "object" || body === null) return null;
  const { nombre, personas, asistencia, alojamiento, comentario } = body as Record<string, unknown>;

  const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";
  if (!nombreLimpio || nombreLimpio.length > 100) return null;
  if (!esAsistencia(asistencia)) return null;

  const va = asistencia === "Sí voy";
  const alojamientoValido = esAlojamiento(alojamiento) ? alojamiento : null;
  if (va && !alojamientoValido) return null;

  const comentarioLimpio = typeof comentario === "string" ? comentario.trim() : "";
  if (comentarioLimpio.length > 500) return null;

  return {
    nombre: nombreLimpio,
    personas: personas === "2" ? 2 : 1,
    asistencia,
    alojamiento: va ? alojamientoValido : null,
    comentario: comentarioLimpio,
  };
}
