---
"@tonaljs/pcset": patch
---

`Pcset.isSubsetOf` and `Pcset.isSupersetOf` return `false` instead of `0` when the reference set is empty, and are typed `boolean` (they were `boolean | 0`). The README now says they test for a proper subset or superset.
