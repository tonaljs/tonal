---
"@tonaljs/progression": minor
"tonal": minor
---

`Progression.fromRomanNumerals` reads a lowercase roman numeral as a minor chord: `fromRomanNumerals("C", ["ii", "ii7"])` returns `["Dm", "Dm7"]` instead of `["D", "D7"]`. Every spelling of a chord type gives the same chord (`iimaj7` and `iiMaj7` are both minor-major sevenths, `ii6/9` and `ii69` are both `Dm69`). A chord type with its own quality (`viio`, `iim7`, `viim7b5`, `ii+`, `ii7#5`) is kept as written, and so is one without a minor form (`ii7b9`) (#457)
