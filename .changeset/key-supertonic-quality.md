---
"@tonaljs/key": patch
"tonal": patch
---

`Key` supertonics now use the right chord quality: a ii-V into a minor chord gets a half-diminished ii (`Em7b5` before `A7` → `Dm`), and a ii-V into a major chord gets a minor seventh ii (`Gm7` before `C7` → `F`). They were swapped. This changes `secondaryDominantSupertonics`, `substituteDominantSupertonics`, their deprecated `...MinorRelative` aliases, and the `ii/` and `subii/` roles of `majorKeyChords` and `minorKeyChords`.
