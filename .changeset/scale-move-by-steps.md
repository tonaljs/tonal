---
"@tonaljs/scale": minor
"tonal": minor
---

Move within a scale: `Scale.transposeBySteps`, `Scale.nearest`, and altered degrees in `Scale.degrees` and `Scale.steps`.

`Scale.transposeBySteps("C major", "E4", 2)` is `"G4"` and `Scale.transposeBySteps("C major", "E4", -3)` is `"B3"`. Pitch classes work too (`"E"` gives `"G"`). Notes are compared by pitch, so enharmonic spellings work, and the result is spelled as in the scale. A note outside the scale gives `""`.

`Scale.nearest("C major", "F#4")` is `"G4"`: the scale note closest to a note, by pitch. A note halfway between two scale notes goes up, so `Gb4` gives `G4` too.

`Scale.degrees` and `Scale.steps` accept a string with accidentals after the number: `Scale.degrees("C major")("7b")` is `"Bb"`, `Scale.degrees("A major")("7b")` is `"G"` (spelled by interval), and `Scale.steps("C4 major")("-1b")` is `"Bb3"`. The number counts scale notes, so `"7b"` is the 7th scale note lowered. A string with the accidentals in front, like `"b7"`, is an interval name (as in `Chord.noteOf`) and gives `""`.
