---
"@tonaljs/pitch": patch
"@tonaljs/pitch-note": patch
"@tonaljs/pitch-interval": patch
"@tonaljs/pitch-distance": patch
"@tonaljs/core": patch
"@tonaljs/array": patch
"@tonaljs/collection": patch
"@tonaljs/midi": patch
"@tonaljs/note": patch
"@tonaljs/pcset": patch
"@tonaljs/progression": patch
"@tonaljs/range": patch
"@tonaljs/scale": patch
"@tonaljs/time-signature": patch
"@tonaljs/voice-leading": patch
"@tonaljs/rhythm-pattern": patch
"tonal": patch
---

No public function throws on invalid input any more, apart from `deprecate` and `ChordType.add`, which aren't music functions. Each gives the empty value of its type:

- Lists (`[]`): `Collection` and `Array` (`compact`, `permutations`, `rotate`, `shuffle`, `sortedNoteNames`…), `Midi.pcset` and the `pcset*` functions, `Note.sortedNames`, `Pcset.filter`, `Progression.fromRomanNumerals` and `toRomanNumerals`, `Range.chromatic` and `numeric`, `Scale.detect` and `scaleNotes`, `RhythmPattern.binary`, `hex`, `probability` and `rotate`, and `VoiceLeading.topNoteDiff`.
- `TimeSignature.get` and `parse` give the empty signature (`[0, 0]`); `coordToNote` and `coordToInterval` give `{ empty: true }`; `altToAcc` and `fillStr` give `""`, `accToAlt` `0`; `tonicIntervalsTransposer` without intervals gives a function that returns `""`.
- The low-level pitch helpers keep their types: `chroma` and `height` give `NaN`, `coordinates` `[NaN]`, `pitch` a pitch of `NaN`s (`isPitch` is false), and `midi` `null`. They'll give `null` in tonal 7.
- `Note.ascending` and `descending` sort invalid notes as equal to the others. A comparator, a `rnd` or a rotation that isn't valid falls back to its default.

The test that calls every public function with invalid values now has no list of known exceptions, only the two exempt functions.
