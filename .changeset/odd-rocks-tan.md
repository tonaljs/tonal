---
"@tonaljs/pitch-interval": minor
"@tonaljs/pitch-note": minor
"tonal": minor
"@tonaljs/note": minor
---

### Export `NoteType` and `IntervalType` types

Typescript types `NoteType` and `IntervalType` are now exported:

```ts
import { Interval, IntervalType, Note, NoteType } from "tonal";

const note: NoteType = Note.get("C4");
const interval: IntervalType = Interval.get("P4");
```
