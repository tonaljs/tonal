---
"@tonaljs/key": patch
"tonal": patch
---

`Key` supertonics have the right chord quality (#232).

- `secondaryDominantSupertonics`: a ii-V into a minor chord gets a half-diminished ii (`Em7b5` before `A7` → `Dm`), and a ii-V into a major chord gets a minor seventh ii (`Gm7` before `C7` → `F`). They were swapped since `@tonaljs/key` 4.11.0 (#447). C major gives `["", "Em7b5", "F#m7b5", "Gm7", "Am7", "Bm7b5", ""]` (it was `["", "Em7", "F#m7", "Gm7b5", "Am7b5", "Bm7", ""]`).
- `substituteDominantSupertonics`: the ii of a substitute dominant is always a minor seventh (`Bbm7` before `Eb7` → `Dm`), because a substitute dominant doesn't resolve to its own tonic. C major gives `["", "Bbm7", "Cm7", "Dbm7", "Ebm7", "Fm7", ""]` (it was `["", "Bbm7", "Cm7", "Dbm7b5", "Ebm7b5", "Fm7", ""]`).

This also changes the deprecated `secondaryDominantsMinorRelative` and `substituteDominantsMinorRelative`, and the `ii/` and `subii/` roles of `majorKeyChords` and `minorKeyChords`. For example, in C major `Em7` is no longer `ii/II` (`Em7b5` is), and `Am7` is now also `ii/V`.

The `@deprecated` tags of the `...MinorRelative` fields name the right replacement and show up in editors.
