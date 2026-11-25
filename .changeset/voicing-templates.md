---
"@tonaljs/voicing": minor
---

Voicing templates: the `template` option of `Voicing.get`, `search` and `sequence` fixes the order of a voicing's notes as chord degrees (`"3-5-7-9"`, `"R | 3-7-9"`), or names a template of tonal's catalogue: `shell`, `guide-tones`, `rootless`, `rootless-spread`, `so-what`, `fourths`, `upper-structure` (and `-II`, `-bIII`, `-bV`, `-bVI`, `-VI`) and `triad-over-root`. Each catalogue template is in two or more jazz piano books (Levine, DeGreg, Jazzology, Haerle, Richards, Mantooth, Siskind, Harrison), cited in the README and the JSDoc. `Voicing.templates()` lists the names.
