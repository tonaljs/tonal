---
"@tonaljs/pitch-interval": minor
"@tonaljs/interval": minor
"tonal": minor
---

**Behaviour change.** `Interval.simplify` keeps the octave, however many octaves an interval spans, and `Interval.invert` gives the interval that completes the simplified interval to an octave. Before, `simplify` kept `8P` but turned `15P` into `1P`, and `invert` kept compound intervals compound and left unisons and octaves as they were. The new results follow music21's semi-simple intervals and complements:

|                    | before  | now     |
| ------------------ | ------- | ------- |
| `simplify("15P")`  | `"1P"`  | `"8P"`  |
| `simplify("-22P")` | `"-1P"` | `"-8P"` |
| `invert("1P")`     | `"1P"`  | `"8P"`  |
| `invert("8P")`     | `"8P"`  | `"1P"`  |
| `invert("1A")`     | `"1d"`  | `"8d"`  |
| `invert("9M")`     | `"14m"` | `"7m"`  |

Other simple intervals are unchanged, and the direction is kept (`invert("-3M")` is still `"-6m"`). `Interval.get(i).simple` follows `simplify`: it's `8` for `"15P"`
