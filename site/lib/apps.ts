// The mini apps of the site. The list is in apps.json so that
// scripts/docs-from-readmes.mjs can link the docs pages to their apps.
import data from "./apps.json";

export type AppInfo = {
  slug: string;
  title: string;
  description: string;
  /** The docs pages of the functions the app uses */
  docs: { title: string; url: string }[];
};

export const apps: AppInfo[] = data;

export function getApp(slug: string): AppInfo {
  const app = apps.find((app) => app.slug === slug);
  if (!app) throw Error(`Unknown app: ${slug}`);
  return app;
}
