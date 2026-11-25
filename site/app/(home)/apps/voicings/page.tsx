import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { Voicings } from "@/components/apps/voicings";
import { getApp } from "@/lib/apps";

const app = getApp("voicings");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <Voicings />
    </AppPage>
  );
}
