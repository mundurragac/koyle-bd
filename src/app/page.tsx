import { Encabezado } from "@/components/encabezado";
import { FormularioRsvp } from "@/components/formulario-rsvp";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <Encabezado titulo="Cumpleaños en Koyle">
        Confirma si vienes para que podamos organizarnos.
      </Encabezado>
      <FormularioRsvp />
    </main>
  );
}
