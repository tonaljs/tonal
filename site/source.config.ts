import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { z } from "zod";

export const { docs, meta } = defineDocs({
  docs: {
    schema: (ctx) =>
      z.object({
        title: z.string(),
        description: z.string().optional(),
        package: z.string().optional(),
      }),
  },
});

export default defineConfig();
