import { auth, sheets } from "@googleapis/sheets";
import { esAlojamiento, esAsistencia, type Rsvp } from "./rsvp";

// Sin nombre de hoja, el rango apunta a la primera pestaña del Sheet.
const RANGO = "A:F";

const cliente = sheets({
  version: "v4",
  auth: new auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  }),
});

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

export async function agregarRsvp(rsvp: Rsvp) {
  const fecha = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
  await cliente.spreadsheets.values.append({
    spreadsheetId,
    range: RANGO,
    // RAW evita que un texto que empiece con "=" se interprete como fórmula.
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[fecha, rsvp.nombre, rsvp.asistencia, rsvp.alojamiento ?? "", rsvp.comentario, rsvp.personas]],
    },
  });
}

const claveNombre = (nombre: string) =>
  nombre.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();

// Si alguien responde más de una vez con el mismo nombre, vale su última respuesta.
export async function obtenerRsvps(): Promise<Rsvp[]> {
  const { data } = await cliente.spreadsheets.values.get({ spreadsheetId, range: RANGO });
  const porNombre = new Map<string, Rsvp>();

  for (const [, nombre = "", asistencia, alojamiento, comentario = "", personas] of data.values ?? []) {
    if (!esAsistencia(asistencia)) continue;
    porNombre.set(claveNombre(nombre), {
      nombre,
      personas: personas === "2" ? 2 : 1,
      asistencia,
      alojamiento: esAlojamiento(alojamiento) ? alojamiento : null,
      comentario,
    });
  }

  return [...porNombre.values()];
}
