---
"@tonaljs/voicing": patch
"tonal": patch
---

`Voicing.get`, `search` and `sequence` with `bass: "root"` voice slash chords: the bass part plays the slash bass and the low interval limits count from it, so `Voicing.get("C/E", { bass: "root" })` is `["E2", "G3", "C4"]` instead of `[]`. The docs explain the options to voice a chart (`{ voices: 4, extensions: "available", bass: "root" }`).
