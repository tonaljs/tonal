# tonal docs

Run development server:

```bash
pnpm dev
```

The package pages (all but `content/docs/index.md`) are generated from the package READMEs by `scripts/docs-from-readmes.mjs`, which runs before `dev` and `build`. Edit the README of the package, not the generated page.

## License

The code of this site (the docs site and its apps) is licensed under the [GNU Affero General Public License v3.0](LICENSE) (`AGPL-3.0-only`): if you run a modified version of it for others to use over a network, you must offer them its source. Two exceptions:

- **The documentation** (`content/docs/`), generated from the READMEs of the tonal packages (and the agent guide), is under the [MIT License](../docs/LICENSE), like the library.
- **`lib/walking-bass-figures.ts`** is under neither license: it holds walking bass figures counted from the FiloBass corpus, whose data are for non-commercial research (see its header).

Code contributed to the site before the change to the AGPL (2026-11-27) was under the MIT License, and those versions stay available under it.

