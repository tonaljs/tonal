---
"@tonaljs/abc-notation": patch
"@tonaljs/array": patch
"@tonaljs/chord": patch
"@tonaljs/chord-detect": patch
"@tonaljs/chord-dictionary": patch
"@tonaljs/chord-type": patch
"@tonaljs/collection": patch
"@tonaljs/core": patch
"@tonaljs/duration-value": patch
"@tonaljs/interval": patch
"@tonaljs/key": patch
"@tonaljs/midi": patch
"@tonaljs/mode": patch
"@tonaljs/modules": patch
"@tonaljs/note": patch
"@tonaljs/pcset": patch
"@tonaljs/pitch": patch
"@tonaljs/pitch-distance": patch
"@tonaljs/pitch-interval": patch
"@tonaljs/pitch-note": patch
"@tonaljs/progression": patch
"@tonaljs/range": patch
"@tonaljs/rhythm-pattern": patch
"@tonaljs/roman-numeral": patch
"@tonaljs/scale": patch
"@tonaljs/scale-dictionary": patch
"@tonaljs/scale-type": patch
"@tonaljs/time-signature": patch
"@tonaljs/voice-leading": patch
"@tonaljs/voicing": patch
"@tonaljs/voicing-dictionary": patch
"tonal": patch
---

- Build `dist/index.js` and `dist/index.d.ts` again, so the `main` and `types` entries of every package resolve. Since the tsdown migration the build wrote `index.cjs` and `index.d.cts` instead, and `require("tonal")` or `import "tonal"` in Node failed with "Cannot find module".
