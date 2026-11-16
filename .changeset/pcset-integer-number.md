---
"@tonaljs/pcset": patch
"tonal": patch
---

`Pcset.get` only reads whole numbers from 0 to 4095 as pcset numbers. A number like `2.5` used to give a non-empty set with the chroma `"0000000010.1"` (and `Pcset.notes(2.5)` gave `["Ab", "B"]`); now it gives the empty set.
