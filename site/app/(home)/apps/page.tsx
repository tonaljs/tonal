import { Card, Cards } from "fumadocs-ui/components/card";
import type { Metadata } from "next";
import { apps } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Apps · tonal",
  description: "Small music theory apps built with tonal.",
};

export default function AppsPage() {
  return (
    <main className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold">Apps</h1>
      <p className="mb-8 text-fd-muted-foreground">
        Small music theory apps built with tonal. Each one shows the tonal code
        behind what you see, and links to its docs.
      </p>
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
    </main>
  );
}
