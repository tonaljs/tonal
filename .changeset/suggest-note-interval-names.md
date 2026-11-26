---
"@tonaljs/pitch-note": minor
"@tonaljs/pitch-interval": minor
"@tonaljs/core": minor
"tonal": minor
---

`NoteName`, `PcName`, `NoteWithOctave` and `IntervalName` now list the common note and interval names, so editors suggest them, and still accept any string. The listed names are exported on their own as `KnownNoteName`, `KnownPcName`, `KnownNoteWithOctave` and `KnownIntervalName`; the known intervals are written number first, as tonal returns them (`3M`, `-5P`). Types only, nothing changes at runtime.

If your code types a `Record<NoteName, X>` (or `Record<IntervalName, X>`), it now needs every known name as a key: use `Partial<Record<NoteName, X>>` or `Record<string, X>` instead.
