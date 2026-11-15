---
"@tonaljs/midi": patch
"@tonaljs/note": patch
"tonal": patch
---

Fix `Note.simplify` dropping the octave of notes outside the midi range (`simplify("C10")` was `"C"`), and `Midi.midiToNoteName` returning `NaN` for negative numbers (`midiToNoteName(-1)` is now `"B-2"`)
