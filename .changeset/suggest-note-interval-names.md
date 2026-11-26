---
"@tonaljs/pitch-note": minor
"@tonaljs/pitch-interval": minor
---

`NoteName`, `PcName`, `NoteWithOctave` and `IntervalName` now list the common note and interval names, so editors suggest them, and still accept any string. The listed names are exported on their own as `KnownNoteName`, `KnownPcName`, `KnownNoteWithOctave` and `KnownIntervalName`. Types only, nothing changes at runtime.
