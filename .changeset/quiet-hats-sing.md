---
"@tonaljs/chord-type": minor
"@tonaljs/chord": minor
"@tonaljs/time-signature": minor
"@tonaljs/pitch-interval": patch
"@tonaljs/pitch-note": patch
"@tonaljs/pcset": patch
"@tonaljs/roman-numeral": patch
"@tonaljs/scale-type": patch
"@tonaljs/mode": patch
"tonal": minor
---

- Add `maj11` chord type (major eleventh) (#476)
- Name `aug7` chord type as "seventh augmented fifth", so `Chord.get("Caug7").type` is no longer empty (#500)
- `Chord.steps` and `Chord.degrees` keep the tonic octave when the chord is given as tokens: `Chord.steps(["C4", "aug"])` (#497)
- `TimeSignature.get` accepts common time (`C`) and cut time (`C|`, `¢`) symbols, and no longer throws on invalid input (#490)
- `Interval.get` rejects malformed intervals like `ddd5` or `5Pgarbage` (#494)
- Faster pitch class set normalization (#499)
- Invalid input is no longer cached, so caches can't grow without limit (#498)
- `Object.prototype` keys like `"constructor"` no longer return built-in functions from `Interval.get`, `RomanNumeral.get`, `ChordType.get`, `ScaleType.get` and `Mode.get`
