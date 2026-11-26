---
"@tonaljs/chart": minor
---

Charts have repeats and endings. `|:` and `:|` start and end a repeat (`:|x3` plays three passes), `|1` or `|1,2` starts an ending, `:|2` ends a repeat and starts ending 2, `||` is a double bar. `Chart.unroll` plays them as a musician reads them, and each played bar has its `pass` and its `ending`:

- `:|` goes back to its `|:`, or to the start of the chart or the bar after the `:|` before; it plays 2 passes, or as many as the highest ending.
- The ending for each pass is played; past the last one, the last ending if it doesn't repeat, otherwise none.
- The last ending lasts until a `||`, or one bar.
- Nested repeats, unclosed repeats and endings without a repeat are listed by `Chart.problems`, and the chart unrolls to `[]`.
