# Cumpleaños en Koyle · RSVP

Formulario de confirmación y dashboard para el fin de semana del 24 y 25 de octubre. Cada respuesta se guarda como fila en un Google Sheet.

- [koyle.undurraga.cc](https://koyle.undurraga.cc) formulario de RSVP
- [koyle.undurraga.cc/dashboard](https://koyle.undurraga.cc/dashboard) lista de quién va, quién no sabe y quién no va, con contador de camas (se actualiza cada 10 segundos)

Stack: Next.js (App Router) + TypeScript + Tailwind, Google Sheets API con cuenta de servicio (`@googleapis/sheets`), deploy en Vercel.

## 1. Crear el Google Sheet

1. Crea un Sheet nuevo en [sheets.google.com](https://sheets.google.com).
2. En la fila 1 de la primera pestaña escribe los encabezados: `Fecha | Nombre | Asistencia | Alojamiento | Comentario | Personas`.
3. Copia el ID del Sheet desde la URL: `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`.

La app lee y escribe siempre en la primera pestaña del Sheet.

## 2. Crear la cuenta de servicio de Google

1. Entra a [console.cloud.google.com](https://console.cloud.google.com) y crea un proyecto (menú de proyectos arriba a la izquierda > Proyecto nuevo).
2. Con el proyecto seleccionado, ve a **APIs y servicios > Biblioteca**, busca **Google Sheets API** y haz clic en **Habilitar**.
3. Ve a **IAM y administración > Cuentas de servicio > Crear cuenta de servicio**. Ponle un nombre (por ejemplo `rsvp-vina`) y termina el asistente sin asignar roles.
4. Abre la cuenta creada, pestaña **Claves > Agregar clave > Crear clave nueva > JSON**. Se descarga un archivo `.json`. Guárdalo en un lugar seguro y no lo subas al repo.
5. Del JSON vas a necesitar dos campos: `client_email` y `private_key`.

## 3. Compartir el Sheet con la cuenta de servicio

En el Sheet, botón **Compartir**, pega el `client_email` de la cuenta de servicio (termina en `.iam.gserviceaccount.com`) y dale permiso de **Editor**. Desmarca "Notificar a las personas".

## 4. Variables de entorno

Crea `.env.local` en la raíz del proyecto:

```bash
GOOGLE_SHEET_ID=ID_del_paso_1
GOOGLE_SERVICE_ACCOUNT_EMAIL=rsvp-vina@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
DASHBOARD_CLAVE=clave_para_ver_el_dashboard
```

`GOOGLE_PRIVATE_KEY` es el valor de `private_key` del JSON tal cual, con los `\n` incluidos y entre comillas dobles.

## 5. Correr en local

```bash
npm install
npm run dev
```

Abre [localhost:3000](http://localhost:3000) para el formulario y [localhost:3000/dashboard](http://localhost:3000/dashboard) para el dashboard. Envía una respuesta de prueba y confirma que aparece la fila en el Sheet.

## 6. Deploy en Vercel

Opción A, con GitHub:

1. Sube el proyecto a un repo de GitHub.
2. En [vercel.com/new](https://vercel.com/new) importa el repo. Vercel detecta Next.js solo.
3. Antes de hacer deploy, en **Environment Variables** agrega las cuatro variables del paso 4. En `GOOGLE_PRIVATE_KEY` pega el valor sin las comillas externas (sirve con `\n` literales o con saltos de línea reales).
4. Deploy.

Opción B, con la CLI:

```bash
npm i -g vercel
vercel link
vercel env add GOOGLE_SHEET_ID
vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
vercel env add GOOGLE_PRIVATE_KEY
vercel env add DASHBOARD_CLAVE
vercel --prod
```

Si cambias una variable de entorno después del deploy, tienes que volver a hacer deploy para que tome el valor nuevo.

## Cómo funciona

- Si una persona responde más de una vez con el mismo nombre (sin importar mayúsculas ni tildes), el dashboard considera solo su última respuesta. En el Sheet quedan todas las filas.
- La cantidad de camas está en `CAMAS` en `src/lib/rsvp.ts`. Si los que se quedan superan ese número, la tarjeta del dashboard se pone en rojo.
- El dashboard pide la clave de `DASHBOARD_CLAVE` y, si es correcta, la recuerda 90 días en una cookie. El formulario sigue abierto.

## Estructura

```
src/
  proxy.ts                 exige la clave en el GET de /api/rsvp
  app/
    page.tsx               formulario
    dashboard/page.tsx     dashboard
    dashboard/acciones.ts  valida la clave y deja la cookie
    api/rsvp/route.ts      GET lista respuestas, POST agrega una fila
  components/
    formulario-rsvp.tsx
    dashboard.tsx
    encabezado.tsx
  lib/
    rsvp.ts                opciones, tipos y validadores compartidos
    sheets.ts              cliente de Google Sheets
```
