export function Encabezado({ titulo, children }: { titulo: string; children?: React.ReactNode }) {
  return (
    <header className="text-center">
      <p className="text-[0.7rem] font-normal uppercase tracking-[0.28em] text-gold-dark">
        24 y 25 de octubre
      </p>
      <h1 className="mt-4 font-serif text-5xl font-light leading-[1.04] tracking-[-0.01em]">
        {titulo}
      </h1>
      <div className="mx-auto mt-5 h-px w-12 bg-gold" />
      {children && <p className="mt-5 text-muted">{children}</p>}
    </header>
  );
}
