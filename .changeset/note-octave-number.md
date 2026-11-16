---
"@tonaljs/pitch-note": patch
"tonal": patch
---

The octave of a note is read as a number: `Note.get("C04").name` is `"C4"` (was `"C04"`, so `Note.sortedUniqNames(["C04", "C4"])` kept both), and `"C-0"` is `"C0"` with `oct: 0` (was `-0`). A minus sign with no octave digits is not a note anymore: `Note.get("C-")` used to be a note with a `NaN` octave and height, and `Note.transpose("C-", "M2")` gave `"D"`; now they give the empty note and `""`.
