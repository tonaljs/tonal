---
"@tonaljs/midi": patch
"tonal": patch
---

`Midi.chroma` returns a pitch class from 0 to 11 for midi numbers below 0 too (`Midi.chroma(-1)` was `-1`, now `11`), so `Midi.pcset([-1])` is `[11]`. `Midi.pcsetNearest` finds the nearest note below midi 0 (`pcsetNearest([2])(-11)` was `undefined`, now `-10`) and for decimal midi numbers like the ones from `freqToMidi` (`pcsetNearest(Scale.get("C major").chroma)(59.96)` was `undefined`, now `60`). Whole midi numbers from 0 to 127 give the same results as before.
