import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";
import { Encabezado } from "@/components/encabezado";

export const metadata: Metadata = {
  title: "Confirmaciones · Cumpleaños en Koyle",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <Encabezado titulo="Confirmaciones" />
      <Dashboard />
    </main>
  );
}
