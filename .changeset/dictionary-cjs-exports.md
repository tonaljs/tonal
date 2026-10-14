---
"@tonaljs/chord-dictionary": patch
"@tonaljs/scale-dictionary": patch
---

Restore the named exports of the CommonJS build. Since the tsdown migration, `require("@tonaljs/chord-dictionary")` returned only the default export, without `addAlias` or `default` (and `require("@tonaljs/scale-dictionary")` also lost `NoScaleType`).
