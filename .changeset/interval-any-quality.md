---
"@tonaljs/pitch-interval": minor
"tonal": minor
---

Intervals can have any number of augmented or diminished: `Interval.get("4AAAAA").semitones` is `10`, and `Interval.add`, `Interval.subtract` and `Interval.distance` give a name for every pair (`Interval.add("4AAAA", "1A")` was `""`, now it's `"4AAAAA"`)
