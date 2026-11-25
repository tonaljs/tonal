---
"@tonaljs/voicing": minor
---

Found while building the voicings app:

- A chord a template gives nothing for (no form for its family, such as a dominant with `"so-what"` or a triad with `"rootless"`, or no form that fits the range) is voiced by the rules with the same options, instead of `[]`. An unknown template name still gives `[]`.
- When there are more voices than tones, the root or the 5th is doubled, and every mix is a candidate (it was the root first, then the 5th). A triad in four voices can now double the 5th, so `{ voices: 4, spacing: "drop2" }` voices D as F#3 A3 D4 A4 in C3–C5. A fixed top note is still doubled first, and the 3rd and the 7th are not doubled.
