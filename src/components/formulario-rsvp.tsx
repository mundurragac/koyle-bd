"use client";

import { useState } from "react";
import { ALOJAMIENTO, ASISTENCIA, type Asistencia } from "@/lib/rsvp";

type Estado = "listo" | "enviando" | "enviado" | "error";

const campo =
  "w-full border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-gold-dark";

export function FormularioRsvp() {
  const [asistencia, setAsistencia] = useState<Asistencia | null>(null);
  const [estado, setEstado] = useState<Estado>("listo");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("enviando");
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    }).catch(() => null);
    setEstado(res?.ok ? "enviado" : "error");
  }

  if (estado === "enviado") {
    return (
      <div className="mt-10 border border-line bg-white p-6 text-center">
        <p className="font-serif text-3xl">¡Gracias!</p>
        <p className="mt-2 text-muted">
          Recibimos tu respuesta. Si cambias de planes, vuelve a enviarla con el mismo nombre.
        </p>
        <button
          type="button"
          onClick={() => {
            setAsistencia(null);
            setEstado("listo");
          }}
          className="mt-5 border border-ink px-6 py-3 text-[0.72rem] font-normal uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-white"
        >
          Enviar otra respuesta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="mt-10 space-y-6">
      <div>
        <label htmlFor="nombre" className="label-caps">
          Nombre
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="nombre"
            name="nombre"
            required
            maxLength={100}
            autoComplete="name"
            className={`${campo} min-w-0 flex-1`}
          />
          <label className="flex shrink-0 cursor-pointer items-center gap-2 border border-line bg-white px-4 transition-colors has-checked:border-gold-dark has-checked:bg-sand">
            <input type="checkbox" name="personas" value="2" className="size-4 accent-gold-dark" />
            Voy con +1
          </label>
        </div>
      </div>

      <Opciones
        nombre="asistencia"
        pregunta="¿Vas a poder ir?"
        opciones={ASISTENCIA}
        onChange={setAsistencia}
      />

      {asistencia === "Sí voy" && (
        <Opciones
          nombre="alojamiento"
          pregunta="¿Te quedas a alojar?"
          opciones={ALOJAMIENTO}
        />
      )}

      <label className="block">
        <span className="label-caps">
          Comentario <span className="text-muted">(opcional)</span>
        </span>
        <textarea
          name="comentario"
          rows={3}
          maxLength={500}
          className={`${campo} mt-2 resize-none`}
        />
      </label>

      {estado === "error" && (
        <p role="alert" className="text-sm text-red-700">
          No pudimos guardar tu respuesta. Intenta de nuevo.
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="w-full bg-gold py-4 text-[0.74rem] font-normal uppercase tracking-[0.16em] text-white transition-colors hover:bg-gold-dark disabled:opacity-60"
      >
        {estado === "enviando" ? "Enviando…" : "Enviar respuesta"}
      </button>
    </form>
  );
}

function Opciones<T extends string>({
  nombre,
  pregunta,
  opciones,
  onChange,
}: {
  nombre: string;
  pregunta: string;
  opciones: readonly T[];
  onChange?: (valor: T) => void;
}) {
  return (
    <fieldset>
      <legend className="label-caps">{pregunta}</legend>
      <div className="mt-2 grid gap-2">
        {opciones.map((opcion) => (
          <label
            key={opcion}
            className="flex cursor-pointer items-center gap-3 border border-line bg-white px-4 py-3 transition-colors has-checked:border-gold-dark has-checked:bg-sand"
          >
            <input
              type="radio"
              name={nombre}
              value={opcion}
              required
              onChange={() => onChange?.(opcion)}
              className="size-4 accent-gold-dark"
            />
            {opcion}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
