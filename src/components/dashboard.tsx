"use client";

import { useEffect, useState } from "react";
import { CAMAS, type Rsvp } from "@/lib/rsvp";

const INTERVALO_MS = 10_000;

export function Dashboard() {
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null);
  const [actualizado, setActualizado] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch("/api/rsvp", { cache: "no-store" });
        if (!res.ok) throw new Error(res.statusText);
        setRsvps(await res.json());
        setActualizado(new Date());
        setError(false);
      } catch {
        setError(true);
      }
    }
    cargar();
    const id = setInterval(cargar, INTERVALO_MS);
    return () => clearInterval(id);
  }, []);

  if (!rsvps) {
    return (
      <p className="mt-10 text-center text-muted">
        {error ? "No se pudieron cargar las respuestas. Reintentando…" : "Cargando…"}
      </p>
    );
  }

  const van = rsvps.filter((r) => r.asistencia === "Sí voy");
  const seQuedan = van.filter((r) => r.alojamiento === "Sí, me quedo").length;
  const soloDia = van.filter((r) => r.alojamiento === "No, voy solo de día").length;
  const faltanCamas = seQuedan > CAMAS;

  return (
    <div className="mt-8 space-y-8">
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`border p-4 ${faltanCamas ? "border-red-200 bg-red-50 text-red-700" : "border-line bg-white"}`}
        >
          <p className="label-caps">Se quedan a dormir</p>
          <p className="mt-2 font-serif text-5xl font-light lining-nums">
            {seQuedan}
            <span className="text-xl"> / {CAMAS}</span>
          </p>
          <p className="mt-1 text-xs font-normal">
            {faltanCamas ? `Sin cama: ${seQuedan - CAMAS}` : `Camas libres: ${CAMAS - seQuedan}`}
          </p>
        </div>
        <div className="border border-line bg-white p-4">
          <p className="label-caps">Van solo de día</p>
          <p className="mt-2 font-serif text-5xl font-light lining-nums">{soloDia}</p>
        </div>
      </div>

      <Lista titulo="Van" rsvps={van} />
      <Lista titulo="Todavía no saben" rsvps={rsvps.filter((r) => r.asistencia === "Todavía no sé")} />
      <Lista titulo="No pueden" rsvps={rsvps.filter((r) => r.asistencia === "No puedo")} />

      <p className="text-center text-xs text-muted">
        {error
          ? "Sin conexión, reintentando…"
          : `Actualizado a las ${actualizado?.toLocaleTimeString("es-CL")}`}
      </p>
    </div>
  );
}

function Lista({ titulo, rsvps }: { titulo: string; rsvps: Rsvp[] }) {
  return (
    <section>
      <h2 className="flex items-baseline justify-between border-b border-line pb-2 font-serif text-2xl">
        {titulo}
        <span className="font-sans text-sm text-muted">{rsvps.length}</span>
      </h2>
      {rsvps.length === 0 ? (
        <p className="py-3 text-sm text-muted">Nadie por ahora.</p>
      ) : (
        <ul className="divide-y divide-line">
          {rsvps.map((r) => (
            <li key={r.nombre} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="font-normal">{r.nombre}</span>
                {r.alojamiento && (
                  <span
                    className={`shrink-0 border px-2 py-0.5 text-[0.65rem] font-normal uppercase tracking-[0.16em] ${r.alojamiento === "Sí, me quedo" ? "border-gold text-gold-dark" : "border-line text-muted"}`}
                  >
                    {r.alojamiento === "Sí, me quedo" ? "Se queda" : "Solo de día"}
                  </span>
                )}
              </div>
              {r.comentario && <p className="mt-1 text-sm text-muted">{r.comentario}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
