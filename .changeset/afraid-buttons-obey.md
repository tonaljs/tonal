---
"@tonaljs/roman-numeral": patch
"@tonaljs/chord-detect": patch
"@tonaljs/progression": patch
"@tonaljs/chord-type": patch
"@tonaljs/scale-type": patch
"@tonaljs/pcset": patch
"@tonaljs/range": patch
"@tonaljs/scale": patch
"tonal": patch
"@tonaljs/midi": patch
"@tonaljs/mode": patch
"@tonaljs/note": patch
"@tonaljs/key": patch
---

#### `default` export is deprecated for @tonaljs modules

Using default exports for single packages are deprecated, so instead of:

```js
import Note from "@tonaljs/note";
```

You should do this:

```js
import * as Note from "@tonaljs/note";
```

The same for all modules.
