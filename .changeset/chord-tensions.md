---
"@tonaljs/chord": minor
---

`Chord.tensions(chord)` lists a chord's tensions as degree names, from a table by its 3rd, 5th and 7th (Pease, Novello). `Chord.classify(chord, note, { key, scale, tensions })` says what a note is over a chord: `"chord tone"`, `"tension"`, `"avoid"` or `"outside"`. `Chord.chordScales(chord, { key })` ranks the chord scales for a key (without options it's unchanged), and `Chord.chordScale(chord, { key })` gives the first one as a full name: `Chord.chordScale("D7", { key: "C major" })` is `"D mixolydian"`. The `tensions` option replaces the default tensions.
