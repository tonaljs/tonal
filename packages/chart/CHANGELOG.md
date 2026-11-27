# @tonaljs/chart

## 1.0.0

### Major Changes

- c774490: A new package, `@tonaljs/chart` (`Chart` in `tonal`): chord charts. Positions and durations are `Time` values (quarter notes, as exact fractions).

  - `parse(text)` reads bars between `|`, chords as written (`Cm7 b9`, `N.C.`), `%`, empty bars, sections (`[A]`), meter changes (`3/4`) and positions (`A7@4`). Chords without a position are placed by the meter's pulses: `| C F G |` is 2+1+1 beats, two chords in 6/8 split the bar in half. `problems(chart)` lists what it couldn't read.
  - `unroll(chart, { choruses })` gives the bars as they're played, with their start, length, meter, section, place in the section and chorus.
  - `chords(chart)` gives the played chords with their start and duration (until the next chord), `chordAt(chords, position)` the chord at a position, and `position(played, "9:3")` a bar and beat of the played form.

### Minor Changes

- 4963a6d: `Chart.fromForm(sections, form)` builds a chart from named sections and a form: `Chart.fromForm({ A: "| C | G |", B: "| F |" }, "A A B A")`. The form is names separated by spaces, with `*n` to play one n times (`"Intro A*2 B A"`), or letters (`"AABA"`). Each section keeps its own meter, repeats and jumps, and starts with its name; an unknown name gives an empty chart, and `Chart.problems` says which.
- d1e5dc0: Charts have jumps: `<D.C.>`, `<D.S.>` (with `<Segno>`), `al Fine` (with `<Fine>`) and `al Coda` (with `<To Coda>` and `<Coda>`). `Chart.unroll` plays them as most players read them:

  - after the jump, repeats aren't taken and only the last ending is played (`repeatsOnJump: true` takes the repeats again);
  - with `choruses`, an `al Coda` or `al Fine` tune plays the part before the jump once per chorus and the jump and the coda (or the Fine) once, at the end of the last chorus; a plain D.C. or D.S. is part of the tune, so each chorus plays the whole tune with its jump;
  - `<To Coda>` and `<Coda>` without a jump are a D.C. al Coda before the coda.

  Marks that don't fit (a D.S. without a segno, a second jump, a `<Fine>` without `al Fine`) are listed by `Chart.problems`.

- 1bb5230: Charts have repeats and endings. `|:` and `:|` start and end a repeat (`:|x3` plays three passes), `|1` or `|1,2` starts an ending, `:|2` ends a repeat and starts ending 2, `||` is a double bar. `Chart.unroll` plays them as a musician reads them, and each played bar has its `pass` and its `ending`:

  - `:|` goes back to its `|:`, or to the start of the chart or the bar after the `:|` before; it plays 2 passes, or as many as the highest ending.
  - The ending for each pass is played; past the last one, the last ending if it doesn't repeat, otherwise none.
  - The last ending lasts until a `||`, or one bar.
  - Nested repeats, unclosed repeats and endings without a repeat are listed by `Chart.problems`, and the chart unrolls to `[]`.

- c2ccace: `Chart.toText(chart)` writes a chart back as text that parses to the same chart, `Chart.transpose(chart, interval)` transposes its chords and keeps everything else, and `Chart.barAt(played, position)` gives the played bar at a position, as `chordAt` does for chords.

  Bar lines next to each other follow one rule: bar lines with only spaces between them are one bar line, except two plain ones, `| |`, which are an empty bar. `:|x3 |3` and `|| |:` no longer add an empty bar between them.

### Patch Changes

- Updated dependencies [5acfe18]
  - @tonaljs/time@1.0.0
