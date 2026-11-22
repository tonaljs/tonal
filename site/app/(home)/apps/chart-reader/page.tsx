import type { Metadata } from "next";
import { AppPage } from "@/components/apps/app-page";
import { ChartReader } from "@/components/apps/chart-reader";
import { getApp } from "@/lib/apps";

const app = getApp("chart-reader");

export const metadata: Metadata = {
  title: `${app.title} · tonal`,
  description: app.description,
};

export default function Page() {
  return (
    <AppPage slug={app.slug}>
      <ChartReader />
    </AppPage>
  );
}
