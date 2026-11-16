---
"@tonaljs/time-signature": patch
"tonal": patch
---

`TimeSignature.get` types 6/16, 9/16 and 12/16 as `compound` (they were `irregular`), and returns an empty signature when a number is not a positive integer (`["4", "x"]` gave `"4/NaN"`).
