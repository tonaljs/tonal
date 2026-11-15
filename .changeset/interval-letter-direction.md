---
"@tonaljs/pitch-interval": minor
"@tonaljs/interval": patch
"tonal": minor
---

Fix `Interval.add`, `Interval.subtract` and `Interval.transposeFifths` results that led to the wrong note. The letter steps now decide the direction of the result, even when the sound goes the other way: `subtract("2d", "1A")` is `2dd` (was `-7AA`) and `subtract("2m", "1AA")` is `2dd` (was `-7AA`). A unison still takes its direction from the sound: `subtract("1P", "1A")` is `-1A`.

**Deprecated:** the `forceDescending` parameter of `coordToInterval`, since the letter steps already give the direction.
