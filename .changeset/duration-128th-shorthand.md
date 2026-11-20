---
"@tonaljs/duration-value": patch
---

The hundred twenty-eighth note has its own shorthand, `"ht"`: it was `"h"`, the half note's, so `DurationValue.get` could never return it by shorthand.
