---
"@tonaljs/note": patch
"@tonaljs/scale": patch
"tonal": patch
---

`Note.sortedUniqNames` (and so `Scale.scaleNotes`) removes every duplicate, even when an enharmonic note sorts between two copies: `Note.sortedUniqNames(["C4", "B#3", "C4"])` is now `["C4", "B#3"]` instead of `["C4", "B#3", "C4"]`.
