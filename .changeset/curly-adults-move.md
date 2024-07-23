---
"tonal": patch
"@tonaljs/note": patch
---

#### Fix: add `Note.distance` back

The documentation said `Note.distance` was available, but was not.

Now you can do:

```js
import { Note } from "tonal";
Note.distance("c4", "e7"); // => "24M"
```
