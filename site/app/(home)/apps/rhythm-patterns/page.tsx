import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { RhythmPatterns } from "@/components/apps/rhythm-patterns";
import { getApp } from "@/lib/apps";

const app = getApp("rhythm-patterns");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug} samples="Drum">
      <RhythmPatterns />
    </AppPage>
  );
}
