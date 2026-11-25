---
"@tonaljs/voicing": minor
"@tonaljs/voicing-dictionary": patch
---

`Voicing.get(chord, options)` and `Voicing.search(chord, options)` voice any chord tonal can parse, by rules instead of a dictionary. By default a voicing has the notes of the symbol, in root position near the middle of C3–C5 (`Voicing.get("C7")` is `C4 E4 G4 Bb4`). Options: `voices` (a number or a range per voice), `extensions` (degrees or `"available"`), `bass` (`"none"`, `"root"`, `"external"`), `range`, `bassRange`, `top`, `degrees`, `previous`, `metric`, `anchor` and `mode`, `lowIntervals`. The rules (tensions by chord family, doubling, low interval limits, the cost of each voicing) are documented in the README with their sources (Levine, DeGreg, Jazzology, Novello, Dobbins, Richards, Lindsay, Tymoczko).

**Migration:** `Voicing.get(chord)` and `Voicing.search(chord)` without a range now use the new rules, so their results change (`Voicing.get("Dm7")` was `F3 A3 C4 E4`, now `D3 F3 A3 C4`). Pass a range array as the second argument for the old dictionary voicings (`Voicing.get("Dm7", ["C3", "C5"])`), which are deprecated and will be removed in tonal 7. For rootless jazz voicings with the new rules, use `{ voices: 4, extensions: "available", bass: "external" }`. `Voicing.sequence` is unchanged for now.

`@tonaljs/voicing-dictionary` exports its `VoicingDictionary` type.
