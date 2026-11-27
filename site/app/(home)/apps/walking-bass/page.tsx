import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { WalkingBass } from "@/components/apps/walking-bass";
import { getApp } from "@/lib/apps";

const app = getApp("walking-bass");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug} samples="Bass and drum">
      <WalkingBass />
    </AppPage>
  );
}
