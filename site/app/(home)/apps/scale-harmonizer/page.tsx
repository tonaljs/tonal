import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { ScaleHarmonizer } from "@/components/apps/scale-harmonizer";
import { getApp } from "@/lib/apps";

const app = getApp("scale-harmonizer");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <ScaleHarmonizer />
    </AppPage>
  );
}
