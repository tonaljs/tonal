---
"@tonaljs/progression": patch
"tonal": patch
---

`Progression.fromRomanNumerals` reads composed chord types, like `Chord.get` does: `fromRomanNumerals("C", ["V7(b9)", "Imaj7(no3)"])` gave `["", ""]` (now `["G7(b9)", "Cmaj7(no3)"]`). So `toRomanNumerals("C", ["G7(b9)"])`, which gives `"V7(b9)"`, now reads back as `"G7(b9)"`.
