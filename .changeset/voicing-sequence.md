---
"@tonaljs/voicing": minor
---

`Voicing.sequence(chords, options)` voices a progression with the options of `Voicing.get`, for every chord or per chord (`{ chord: "G7", voices: 5 }`), and chooses the smoothest path over the whole progression with `VoiceLeading.path` (exact, not greedy). Each step costs the voice-leading distance plus the voicing's own register and spacing cost; `maxLeap` limits the move of each voice.

**Migration:** `Voicing.sequence(chords)` without a range now uses the new rules, so its results change. Pass a range array as the second argument for the old dictionary voicings, which are deprecated and will be removed in tonal 7.
