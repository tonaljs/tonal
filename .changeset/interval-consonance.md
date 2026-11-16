---
"@tonaljs/interval": minor
"tonal": minor
---

Interval consonance: `Interval.consonance` and `Interval.isConsonant`.

`Interval.consonance` classifies an interval as `"perfect"` (unison, fifth and octave), `"imperfect"` (major and minor thirds and sixths) or `"dissonant"` (seconds, sevenths, the perfect fourth, and every augmented or diminished interval), and gives `""` for an invalid interval. Direction and octaves don't change it (`Interval.consonance("-12P")` is `"perfect"`), and the spelling decides, not the sound: `Interval.consonance("4d")` is `"dissonant"`. The perfect fourth is a dissonance unless you pass `{ consonantFourth: true }`.

`Interval.isConsonant("6M")` is `true`: the interval is a perfect or imperfect consonance.
