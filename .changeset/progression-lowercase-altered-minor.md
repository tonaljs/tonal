---
"@tonaljs/progression": patch
"tonal": patch
---

`Progression.fromRomanNumerals` makes the third of a lowercase numeral minor and keeps the rest of the chord type, alterations included: `fromRomanNumerals("C", ["ii7b9", "ii13#11", "ii7(b9)"])` gave `["D7b9", "D13#11", "D7(b9)"]` (now `["Dm7b9", "Dm13#11", "Dm7(b9)"]`). A flat fifth gives a half-diminished chord: `ii7b5` was `D7b5` and is now `Dm7b5`, and `ii7b5b9` is `Dm7b5b9`. A chord type with a `#9` stays as written (`ii7#9` is `D7#9`), since its minor third would be the same note as the `#9`.
