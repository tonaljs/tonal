import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  basePath: "/tonal",
  output: "export",
  // write every page as a folder with an index.html, which GitHub Pages serves
  // at the same url (next to the page .html, export also writes a folder)
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
