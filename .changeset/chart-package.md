---
"@tonaljs/chart": major
"tonal": minor
---

A new package, `@tonaljs/chart` (`Chart` in `tonal`): chord charts. Positions and durations are `Time` values (quarter notes, as exact fractions).

- `parse(text)` reads bars between `|`, chords as written (`Cm7 b9`, `N.C.`), `%`, empty bars, sections (`[A]`), meter changes (`3/4`) and positions (`A7@4`). Chords without a position are placed by the meter's pulses: `| C F G |` is 2+1+1 beats, two chords in 6/8 split the bar in half. `problems(chart)` lists what it couldn't read.
- `unroll(chart, { choruses })` gives the bars as they're played, with their start, length, meter, section, place in the section and chorus.
- `chords(chart)` gives the played chords with their start and duration (until the next chord), `chordAt(chords, position)` the chord at a position, and `position(played, "9:3")` a bar and beat of the played form.
