---
"@tonaljs/voicing-dictionary": minor
"@tonaljs/duration-value": minor
"@tonaljs/time-signature": minor
"@tonaljs/voice-leading": minor
"@tonaljs/abc-notation": minor
"@tonaljs/collection": minor
"@tonaljs/interval": minor
"@tonaljs/voicing": minor
"@tonaljs/chord": minor
"@tonaljs/range": minor
"tonal": minor
"@tonaljs/mode": minor
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
