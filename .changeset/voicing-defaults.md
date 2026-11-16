---
"@tonaljs/voicing": minor
"tonal": minor
---

**Behaviour change.** `Voicing.get` now returns `[]` when no voicing is found (it was `undefined`); check `voicing.length === 0` instead of `!voicing` or `??`, because `[]` is truthy. `Voicing.search` without a dictionary now searches `VoicingDictionary.all` (it was `VoicingDictionary.triads`), the same default as `Voicing.get`, so it returns more results:

|                           | before      | now          |
| ------------------------- | ----------- | ------------ |
| `Voicing.search("Cmaj7")` | `[]`        | two voicings |
| `Voicing.get("C13")`      | `undefined` | `[]`         |

`Voicing.sequence` keeps `[]` at the position of chords without voicing, and voice-leads the next chord from the last chord that had a voicing
