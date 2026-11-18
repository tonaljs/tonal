import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookIcon, KeyboardMusicIcon } from "lucide-react";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Tonal",
    },
    links: [
      {
        text: "Documentation",
        icon: <BookIcon />,
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "Apps",
        icon: <KeyboardMusicIcon />,
        url: "/apps",
        active: "nested-url",
      },
    ],
    githubUrl: "https://github.com/tonaljs/tonal",
  };
}
