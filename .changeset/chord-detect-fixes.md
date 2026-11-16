---
"@tonaljs/chord-detect": minor
"@tonaljs/chord-type": minor
"@tonaljs/chord": minor
"tonal": minor
---

`Chord.detect` finds the bass and ranks names better, and every name it returns parses back. This changes its output:

- When every note has an octave, the lowest note is the bass, whatever the order: `Chord.detect(["A3", "C4", "F3"])` is `["FM", "Am#5/F"]` (it was `["Am#5", "FM/A"]`). Without octaves, the first note is still the bass.
- Unusual readings go after inversions, with a rule adapted from sharp11: no perfect fifth and no stated altered fifth (except dominant chords without fifth, like `C7no5`), a fifth with a minor third and a minor sixth, a sixth chord with an added fourth, or `o7M7`. `Chord.detect(["E4", "G4", "C5"])` is `["CM/E", "Em#5"]` (it was `["Em#5", "CM/E"]`), `Chord.detect(["E", "G", "B", "C"])` is `["Cmaj7/E", "Emb6"]` and `Chord.detect(["C", "F", "Bb", "Eb"])` is `["F7sus4/C", "Bbsus24/C", "Cquartal"]` (it started with `"C4"`).
- Among names with the same notes over the same root, the one that spells the given notes goes first: `Chord.detect(["Eb", "G", "B", "D"])` starts with `"Ebmaj7#5"` (it was `"EbM7b6"`).
- A new `exclude` option leaves out chord types by name or alias: `Chord.detect(["C", "F", "Bb", "Eb"], { exclude: ["quartal"] })` is `["F7sus4/C", "Bbsus24/C"]`.

Three chord types have a new first alias, so they're printed differently by `Chord.detect`, `Scale.scaleChords`, `Scale.extended`, `Scale.reduced`, `Chord.extended`, `Chord.reduced` and `Progression.fromRomanNumerals` (`iimaj7` in C is `DmMaj7`, it was `Dm/ma7`). No alias is removed, so the old names still parse:

- `mMaj7` (was `m/ma7`, which made inversions like `Cm/ma7/Eb`): `Chord.detect(["Eb", "G", "B", "C"])` is `["CmMaj7/Eb"]`.
- `7b9sus4` (was `b9sus`: `Chord.get("Cb9sus")` is Cb plus `9sus`): `Chord.detect(["C", "F", "G", "Bb", "Db"])` starts with `"C7b9sus4"`.
- `quartal` (was `4`, so `C4` read as a note).
