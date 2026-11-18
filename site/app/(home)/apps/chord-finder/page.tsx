import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { ChordFinder } from "@/components/apps/chord-finder";
import { getApp } from "@/lib/apps";

const app = getApp("chord-finder");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <ChordFinder />
    </AppPage>
  );
}
