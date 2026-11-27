---
"@tonaljs/scale": minor
---

`Scale.approaches(scale, target)` gives the notes that lead to a target note, each with an octave next to it: a half step below or above, the nearest scale note below or above, the target's fifth a fourth below or a fifth above, and the enclosures and double chromatic approaches made of them. With `Chord.chordScale` the scale is the chord's scale in a key: `Scale.approaches(Chord.chordScale("G7", { key: "C major" }), "G2").scaleBelow` is `"F2"`.
