---
"@tonaljs/interval": minor
"tonal": minor
---

Add `Interval.pitchClass`, `Interval.negate`, `Interval.abs` and `Interval.multiply`. `pitchClass` drops octaves and direction, like the distance between pitch classes (`pitchClass("-3M")` is `"6m"`), `negate` turns the direction around (`negate("3M")` is `"-3M"`), `abs` gives the ascending interval (`abs("-3M")` is `"3M"`), and `multiply` stacks an interval a number of times (`multiply("5P", 3)` is `"13M"`)
