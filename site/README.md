# tonal docs

Run development server:

```bash
pnpm dev
```

The package pages (all but `content/docs/index.md`) are generated from the package READMEs by `scripts/docs-from-readmes.mjs`, which runs before `dev` and `build`. Edit the README of the package, not the generated page.
