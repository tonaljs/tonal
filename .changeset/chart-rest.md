---
"@tonaljs/chart": minor
---

`N.C.` (no chord) is marked as a rest: its chord has `rest: true`, in `Chart.parse` and in the played chords of `Chart.chords` (so `Chart.chordAt(chords, position)?.rest` says whether nothing plays there). Other chords have no `rest` field.
