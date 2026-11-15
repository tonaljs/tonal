---
"@tonaljs/pitch-interval": patch
"@tonaljs/interval": patch
"tonal": patch
---

Fix `Interval.add`, `Interval.subtract` and `Interval.transposeFifths` so the letter steps decide the direction of the result, even when the sound goes the other way: `subtract("2d", "1A")` is `2dd` (was `-7AA`) and `subtract("2m", "1AA")` is `2dd` (was `-7AA`). A unison still takes its direction from the sound: `subtract("1P", "1A")` is `-1A`.

The `forceDescending` parameter of `coordToInterval` is deprecated: the letter steps already give the direction.
