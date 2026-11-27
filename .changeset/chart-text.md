---
"@tonaljs/chart": minor
---

`Chart.toText(chart)` writes a chart back as text that parses to the same chart, `Chart.transpose(chart, interval)` transposes its chords and keeps everything else, and `Chart.barAt(played, position)` gives the played bar at a position, as `chordAt` does for chords.

Bar lines next to each other are read as musicians write them: one that ends something and one that starts something are one bar line (`:|x3 |3` and `|| |:` no longer add an empty bar between them), and any other spaces between bar lines are an empty bar (`|: |` is an empty bar with a repeat start).
