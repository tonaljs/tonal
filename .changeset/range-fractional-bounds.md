---
"@tonaljs/collection": patch
"@tonaljs/array": patch
"@tonaljs/range": patch
"tonal": patch
---

`Collection.range` (and `Range.numeric` / `Range.chromatic`) no longer hang when a bound is not a whole number, like `Range.numeric([Midi.freqToMidi(261), 72])`. Non-finite bounds give an empty range.
