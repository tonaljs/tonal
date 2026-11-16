---
"@tonaljs/roman-numeral": minor
"@tonaljs/progression": minor
"tonal": minor
---

Applied (secondary) chords. `RomanNumeral.get("V7/V")` has `of: "V"`, and its `interval`, `step` and `alt` locate the chord's root from the tonic (`2M`). `Progression.fromRomanNumerals("C", ["V7/V", "V/V/V"])` gives `["D7", "A"]`. `RomanNumeral.tokenize` returns the applied degree as a fifth element.

`Progression.fromRomanNumerals` gives an empty string when a numeral's chord type isn't a known chord type, instead of a made-up chord: `V65` was `G65`, `It6` was `Ct6` and `VIIb5` was `Bb5`. A lowercase numeral with a bass note is minor (`i/Eb` is `Cm/Eb`, it was `C/Eb`).
