---
"@tonaljs/scale": patch
"tonal": patch
---

Scale.get ignores case.

Now both calls returns the same scale:

```js
Scale.get("C Major");
Scale.get("c major");
```
