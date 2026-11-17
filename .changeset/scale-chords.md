---
"@tonaljs/scale": minor
"tonal": minor
---

`Scale.chords(scale, { size, step })`: the chord built on each degree of any scale, by stacking scale notes. Each chord has its `degree`, its `notes` and its `symbol`.

`Scale.chords("C major", { size: 4 })[6]` is `{ degree: 7, notes: ["B", "D", "F", "A"], symbol: "Bm7b5" }`, and `Scale.chords("C melodic minor", { size: 4 })` gives `CmMaj7 Dm7 Ebmaj7#5 F7 G7 Am7b5 Bm7b5`. `size` is the number of notes (3, triads, by default) and `step` the scale steps between them (2, thirds, by default; 3 for fourths, 1 for seconds). With an octave in the tonic, the notes have octaves: `Scale.chords("C4 major")[4].notes` is `["G4", "B4", "D5"]`.

The symbol is the chord type that spells the notes, or one with the same notes over the same root, or `""` when no chord type has them. A major triad is written `"C"`, as in `Key`. The melodic minor tonic is `CmMaj7`, while `Key.minorKey("C").melodic.chords` keeps `Cm6`.

`@tonaljs/scale` now depends on `@tonaljs/chord-detect`.
