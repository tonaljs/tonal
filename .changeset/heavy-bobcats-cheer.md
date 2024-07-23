---
"tonal": patch
"@tonaljs/midi": patch
"@tonaljs/key": patch
"@tonaljs/chord-type": patch
---

#### `default` export is deprecated

Using default exports for single packages are deprecated, so instead of:

```js
import Note from "@tonaljs/note";
```

You should do this:

```js
import * as Note from "@tonaljs/note";
```

The same for all modules.
