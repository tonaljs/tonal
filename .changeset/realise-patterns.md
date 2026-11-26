---
"@tonaljs/voicing": minor
"@tonaljs/chord": minor
"@tonaljs/note": minor
"@tonaljs/pattern": patch
"tonal": minor
---

Play note patterns over voicings and keep them in a register.

- `Voicing.steps(voicing)` gives a function from a position to a note, 0 being the lowest voice, like `Scale.steps` and `Chord.steps`: `[0, 1, 2, 3].map(Voicing.steps(["C4", "E4", "G4"]))` is `["C4", "E4", "G4", "C5"]`. Past the top voice the voicing repeats above itself, moved up the fewest octaves that put its lowest note at or above the top note (two for C3 G3 E4), so `Pattern` arpeggios keep going up. Negative positions go down the same way.
- `Note.fold(notes, [low, high])` moves a figure by octaves into a range, keeping its shape and spelling; with `{ each: true }` each note moves on its own. `Note.fold(["C2", "E2", "G2", "Bb2"], ["E2", "G3"])` is `["C3", "E3", "G3", "Bb3"]`.
- `Chord.bass(chord, octave?)` is the slash bass, or the root: `Chord.bass("C7/E", 2)` is `"E2"`, `Chord.bass("C7")` is `"C"`.

The pattern README plays patterns over voicings with `Voicing.steps`. The chord README shows approach notes for bass lines (a half step or a scale step below or above, the fifth, enclosures) as transpositions of the target.
