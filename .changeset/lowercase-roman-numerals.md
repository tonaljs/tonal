---
"@tonaljs/progression": minor
"tonal": minor
---

`Progression.fromRomanNumerals` reads a lowercase roman numeral as a minor chord: `fromRomanNumerals("C", ["ii", "ii7"])` returns `["Dm", "Dm7"]` instead of `["D", "D7"]`. A chord type with its own quality (`viio`, `iim7`, `viim7b5`) is kept as written (#457)
