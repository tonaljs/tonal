---
"@tonaljs/chord": patch
---

`Chord.get` no longer reads symbols that double an interval or put a bare major seventh after a seventh. `Cmaj7maj7`, `Cmaj7(maj7)`, `Csus4sus4`, `C7maj7` and `C4maj7` were chords with a repeated 7M or 4P, a dominant silently turned into a major seventh, or a quartal chord; they're now empty. The major seventh still replaces a seventh in parentheses, as charts write it: `Cm9(^7)`, `Cdim7(maj7)`, `C7(maj7)`.
