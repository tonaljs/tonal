---
"@tonaljs/midi": patch
"tonal": patch
---

`Midi.pcset` rounds decimal midi numbers to the nearest note and ignores numbers that aren't finite, so a pitch class set is always whole numbers from 0 to 11, and `pcsetNearest`, `pcsetSteps` and `pcsetDegrees` return whole midi numbers for a set built from decimal midi. `Midi.chroma` keeps the fraction of a decimal midi number, which is now documented.
