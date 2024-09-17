import { type HomeLayoutProps } from "fumadocs-ui/home-layout";
import { BookIcon, GithubIcon } from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: HomeLayoutProps = {
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
      text: "Repository",
      icon: <GithubIcon />,
      url: "https://github.com/tonaljs/tonal",
    },
  ],
};
