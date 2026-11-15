---
"@tonaljs/midi": patch
"@tonaljs/range": patch
"tonal": patch
---

Fix `isMidi` and `toMidi`: empty or blank strings, `null`, arrays and booleans are not midi numbers anymore (`toMidi("")` was `0`) (see #519)
