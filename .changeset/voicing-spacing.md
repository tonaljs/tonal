---
"@tonaljs/voicing": minor
---

Spacing of voicings, measured in chord steps (Dmitri Tymoczko, *Tonality: An Owner's Manual*):

- The `spacing` option of `Voicing.get`, `search` and `sequence` keeps only voicings with a spacing: `"close"`, `"open"`, `"drop2"`, `"drop3"`, `"drop24"` (Gary Lindsay, *Jazz Arranging Techniques*, ch. 11), `"spread"` (ch. 16), `"block"` (close under the top note, doubled an octave below), or the chord steps between neighbour voices (`[2, 1, 2]`).
- `Voicing.analyze(notes, chord?)` describes a voicing: notes, bass, top, span, chord steps, the named spacing, and the degree of each note.
- `Voicing.invert(notes, n)` moves every voice along the voicing's own notes, keeping its spacing.
- `Voicing.drop(notes, n)` lowers voices an octave, counting from the top.
