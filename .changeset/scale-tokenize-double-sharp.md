---
"@tonaljs/scale": patch
"tonal": patch
---

A scale whose tonic has a double sharp written as `x` works now: `Scale.get("Cx major")` used to be the empty scale, because `Scale.tokenize("Cx major")` gave `["C##", "ajor"]`; now it gives `["C##", "major"]`, the same as `"C## major"`.
