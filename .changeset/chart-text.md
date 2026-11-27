---
"@tonaljs/chart": minor
---

`Chart.toText(chart)` writes a chart back as text that parses to the same chart, `Chart.transpose(chart, interval)` transposes its chords and keeps everything else, and `Chart.barAt(played, position)` gives the played bar at a position, as `chordAt` does for chords.

Bar lines next to each other follow one rule: bar lines with only spaces between them are one bar line, except two plain ones, `| |`, which are an empty bar. `:|x3 |3` and `|| |:` no longer add an empty bar between them.
