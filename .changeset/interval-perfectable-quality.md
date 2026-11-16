---
"@tonaljs/pitch-interval": patch
"tonal": patch
---

A unison, fourth, fifth or octave with a major or minor quality is not an interval anymore: `Interval.get("5m")` used to be a perfect fifth (`semitones: 7`) and `Note.transpose("C4", "5m")` gave `"G4"`; now they give the empty interval and `""`, like `"2P"` already did.
