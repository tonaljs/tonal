---
"@tonaljs/rhythm-pattern": patch
---

`RhythmPattern.rotate` takes any array of numbers and returns the same type, so it rotates a `number[]` of 0s and 1s (built with `map`, for example) as well as probabilities or accents. It was typed for `RhythmPattern` only.
