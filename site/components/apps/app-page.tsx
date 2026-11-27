import Link from "next/link";
import type { ReactNode } from "react";
import { getApp } from "@/lib/apps";

const SOURCE =
  "https://github.com/tonaljs/tonal/blob/main/site/components/apps";
const LICENSE = "https://github.com/tonaljs/tonal/blob/main/site/LICENSE";

/** The frame of an app page: title, description, and links to its docs. */
export function AppPage({
  slug,
  samples = "Piano",
  children,
}: {
  slug: string;
  /** The samples the app plays, for the credit */
  samples?: string;
  children: ReactNode;
}) {
  const app = getApp(slug);
  return (
    <main className="mx-auto w-full max-w-(--fd-layout-width) px-4 py-8 md:py-12">
      <nav className="mb-4 text-sm text-fd-muted-foreground">
        <Link href="/apps/" className="hover:text-fd-foreground">
          Apps
        </Link>
        {" / "}
        <span className="text-fd-foreground">{app.title}</span>
      </nav>
      <h1 className="mb-2 text-3xl font-bold">{app.title}</h1>
      <p className="mb-8 text-fd-muted-foreground">{app.description}</p>
      {children}
      <footer className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-fd-border pt-4 text-sm text-fd-muted-foreground">
        <span>
          Docs:{" "}
          {app.docs.map((doc, i) => (
            <span key={doc.url}>
              {i > 0 ? ", " : null}
              <Link
                href={doc.url}
                className="underline hover:text-fd-foreground"
              >
                {doc.title}
              </Link>
            </span>
          ))}
        </span>
        <a
          href={`${SOURCE}/${slug}.tsx`}
          className="underline hover:text-fd-foreground"
        >
          Source of this app
        </a>
        <a href={LICENSE} className="underline hover:text-fd-foreground">
          License: AGPL-3.0
        </a>
        <span>
          {samples} samples played with{" "}
          <a
            href="https://github.com/danigb/smplr"
            className="underline hover:text-fd-foreground"
          >
            smplr
          </a>
        </span>
      </footer>
    </main>
  );
}
