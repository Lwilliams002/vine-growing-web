export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="border-b border-border bg-card px-6 py-24">
      <div className="mx-auto max-w-6xl animate-fade-up">
        <span className="eyebrow mb-6 block text-primary">{eyebrow}</span>
        <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-tighter md:text-8xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-8 max-w-2xl text-pretty text-lg text-foreground/70">{intro}</p>
        ) : null}
      </div>
    </header>
  );
}
