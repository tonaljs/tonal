import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { Reharmonizer } from "@/components/apps/reharmonizer";
import { getApp } from "@/lib/apps";

const app = getApp("reharmonizer");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <Reharmonizer />
    </AppPage>
  );
}
