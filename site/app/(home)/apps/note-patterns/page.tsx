import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { NotePatterns } from "@/components/apps/note-patterns";
import { getApp } from "@/lib/apps";

const app = getApp("note-patterns");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <NotePatterns />
    </AppPage>
  );
}
