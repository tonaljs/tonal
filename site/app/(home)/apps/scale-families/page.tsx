import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { ScaleFamilies } from "@/components/apps/scale-families";
import { getApp } from "@/lib/apps";

const app = getApp("scale-families");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <ScaleFamilies />
    </AppPage>
  );
}
