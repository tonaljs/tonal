---
"@tonaljs/abc-notation": patch
"@tonaljs/array": patch
"@tonaljs/chart": patch
"@tonaljs/chord": patch
"@tonaljs/chord-detect": patch
"@tonaljs/chord-dictionary": patch
"@tonaljs/chord-type": patch
"@tonaljs/collection": patch
"@tonaljs/core": patch
"@tonaljs/duration-value": patch
"@tonaljs/interval": patch
"@tonaljs/key": patch
"@tonaljs/midi": patch
"@tonaljs/mode": patch
"@tonaljs/modules": patch
"@tonaljs/note": patch
"@tonaljs/pattern": patch
"@tonaljs/pcset": patch
"@tonaljs/pitch": patch
"@tonaljs/pitch-distance": patch
"@tonaljs/pitch-interval": patch
"@tonaljs/pitch-note": patch
"@tonaljs/progression": patch
"@tonaljs/range": patch
"@tonaljs/rhythm-pattern": patch
"@tonaljs/roman-numeral": patch
"@tonaljs/scale": patch
"@tonaljs/scale-dictionary": patch
"@tonaljs/scale-type": patch
"@tonaljs/time": patch
"@tonaljs/time-signature": patch
"@tonaljs/voice-leading": patch
"@tonaljs/voicing": patch
"@tonaljs/voicing-dictionary": patch
"tonal": patch
---

Declare every package side-effect free (`"sideEffects": false`), so bundlers can leave out the modules an app doesn't use: `import { Note } from "tonal"` bundles to about 8 KB instead of 44 KB.
