---
"@tonaljs/progression": patch
"tonal": patch
---

`Progression.fromRomanNumerals` reads a lowercase numeral with an altered chord type as minor, like the rest of the lowercase numerals: `fromRomanNumerals("C", ["ii7b9", "ii13#11", "ii7(b9)"])` gave `["D7b9", "D13#11", "D7(b9)"]` (now `["Dm7b9", "Dm13#11", "Dm7(b9)"]`). A chord type stays as written when its minor form isn't a minor chord: `ii7b5` is still `D7b5` (`m7b5` is half-diminished), and `ii7#9` is still `D7#9` (its minor third would be the same note as the `#9`).
