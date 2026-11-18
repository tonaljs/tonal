import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { ScaleChords } from "@/components/apps/scale-chords";
import { getApp } from "@/lib/apps";

const app = getApp("scale-chords");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <ScaleChords />
    </AppPage>
  );
}
