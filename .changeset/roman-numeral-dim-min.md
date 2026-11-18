---
"@tonaljs/roman-numeral": patch
"@tonaljs/progression": patch
"tonal": patch
---

Roman numerals read chord types with an `i` or a `v` in them: `RomanNumeral.get("viidim7")` and `"iimin7"` were empty, so `Progression.fromRomanNumerals("C", ["viidim7", "iimin7"])` gave `["", ""]` (now `["Bdim7", "Dmin7"]`). `Progression.toRomanNumerals("C", ["Bdim7"])` gives `"VIIdim7"`, which now reads back as `"Bdim7"`.
