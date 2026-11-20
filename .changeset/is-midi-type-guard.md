---
"@tonaljs/midi": minor
---

`Midi.isMidi` accepts numeric strings like `"60"`, but its type guard said the value was a `number`, so TypeScript let you call number methods on a string. The guard now narrows to a number or a numeric string.

**Migration (TypeScript only):** code that passes a value checked with `isMidi` to a function that only takes numbers, such as `if (Midi.isMidi(v)) Midi.midiToFreq(v)`, no longer compiles. Convert it first: `Midi.midiToFreq(Midi.toMidi(v)!)` or `Midi.midiToFreq(+v)`. Nothing changes at runtime.
