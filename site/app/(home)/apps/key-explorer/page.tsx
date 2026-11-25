import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { KeyExplorer } from "@/components/apps/key-explorer";
import { getApp } from "@/lib/apps";

const app = getApp("key-explorer");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <KeyExplorer />
    </AppPage>
  );
}
