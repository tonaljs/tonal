import { Card, Cards } from "fumadocs-ui/components/card";
import Link from "next/link";
import { apps } from "@/lib/apps";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-(--fd-layout-width) flex-1 flex-col gap-12 px-4 py-12 md:py-20">
      <section className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">tonal</h1>
        <p className="max-w-xl text-lg text-fd-muted-foreground">
          A music theory library for JavaScript and TypeScript: notes,
          intervals, chords, scales, keys and more, as pure functions.
        </p>
        <code className="rounded-lg border border-fd-border bg-fd-card px-4 py-2 font-mono text-sm">
          npm install tonal
        </code>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/docs/"
            className="rounded-lg bg-fd-primary px-4 py-2 font-medium text-fd-primary-foreground hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/apps/"
            className="rounded-lg border border-fd-border px-4 py-2 font-medium hover:bg-fd-accent"
          >
            Try the apps
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Apps</h2>
        <Cards>
          {apps.map((app) => (
            <Card
              key={app.slug}
              href={`/apps/${app.slug}/`}
              title={app.title}
              description={app.description}
            />
          ))}
        </Cards>
      </section>
    </main>
  );
}
