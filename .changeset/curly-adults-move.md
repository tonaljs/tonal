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

#### Note `default` export is deprecated

Using default exports for single packages are discouraged. For `note` module is now deprecated, so instead of:

```js
import Note from "@tonaljs/note";
```

You should do this:

```js
import * as Note from "@tonaljs/note";
```
