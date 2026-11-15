---
"@tonaljs/key": patch
"tonal": patch
---

Fix `majorTonicFromKeySignature`: only strings made of all `b` or all `#` are read as a key signature (`"F#"` and `"b#"` now give `null`), and `""` gives `"C"` (see #517)
