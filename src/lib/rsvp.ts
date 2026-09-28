export const ASISTENCIA = ["Sí voy", "Todavía no sé", "No puedo"] as const;
export const ALOJAMIENTO = ["Sí, me quedo", "No, voy solo de día"] as const;
export const CAMAS = 8;

export type Asistencia = (typeof ASISTENCIA)[number];
export type Alojamiento = (typeof ALOJAMIENTO)[number];

export type Rsvp = {
  nombre: string;
  personas: 1 | 2;
  asistencia: Asistencia;
  alojamiento: Alojamiento | null;
  comentario: string;
};

export const esAsistencia = (v: unknown): v is Asistencia =>
  ASISTENCIA.includes(v as Asistencia);

export const esAlojamiento = (v: unknown): v is Alojamiento =>
  ALOJAMIENTO.includes(v as Alojamiento);
