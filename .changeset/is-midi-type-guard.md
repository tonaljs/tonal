---
"@tonaljs/midi": patch
---

`Midi.isMidi` accepts numeric strings like `"60"`, but its type guard said the value was a `number`, so TypeScript let you call number methods on a string. The guard now narrows to a number or a numeric string.
