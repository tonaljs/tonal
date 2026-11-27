# @tonaljs/chart ![tonal](https://img.shields.io/badge/@tonaljs-chart-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chart.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chart)

> Chord charts: bars, sections and meters, the played form, and the chord at a position

A chord chart is what a lead sheet or a fake book shows: bars of chord symbols, with sections and meters. `Chart` reads one from text, gives the bars in the order they're played, and answers which chord plays at a position. Positions and durations are exact [time values](/packages/time): quarter notes, as `[numerator, denominator]` fractions.

```js
import { Chart } from "tonal";

const chart = Chart.parse("[A] | Dm7 G7 | Cmaj7 |\n[B] | Fmaj7 | 3/4 E7 |");
const chords = Chart.chords(chart);
Chart.chordAt(chords, 3)?.value; // => "G7"
```

It describes where chords are, not when they play: there are no seconds and no tempo yet.

A chart is plain data (bars with their meter, chords and marks; see `Chart.parse`), and every other function works on it. The text syntax is one way to build it; an app that reads another format (another app's charts, MusicXML, its own editor) can build the bars itself, and `Chart.toText` writes any chart back as text.

## Usage

ES6:

```js
import { Chart } from "tonal";
```

node:

```js
const { Chart } = require("tonal");
```

single module:

```js
import { parse, chords } from "@tonaljs/chart";
```

## The written chart

### `Chart.parse`

`parse(text: string, options?: { meter?: string }) => Chart`

Read a chart from text: bars between `|`, chords separated by spaces.

```js
Chart.parse("| Dm7 G7 | Cmaj7 |").bars;
// => [
//   { meter: "4/4", chords: [{ value: "Dm7", at: [0, 1] }, { value: "G7", at: [2, 1] }] },
//   { meter: "4/4", chords: [{ value: "Cmaj7", at: [0, 1] }] },
// ]
```

Each bar has its `meter` and its `chords`, each chord its symbol as written (`value`) and where it starts in the bar (`at`, in quarter notes). The first bar of a section has its `section` name.

The syntax:

| Write                       | Means                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| `\|`                        | a bar line; a new line ends a bar too, and `\|\|` is a bar line                                          |
| `Cmaj7`, `Cm7 b9`           | a chord: a word starting with a note letter, with the words after it that aren't chords (its qualifiers) |
| `N.C.`                      | no chord: a rest (the chord has `rest: true`)                                                            |
| `%`                         | the chords of the bar before                                                                             |
| `\| \|`                     | an empty bar: the chord before goes on                                                                   |
| `[A]`, `[Verse 1]`          | a section starts on this bar (alone between bar lines, `\| [A] \| C \|`, on the next bar)                |
| `3/4`, `2+2+3/8`            | the meter changes from this bar on (4/4 by default, or `options.meter`)                                  |
| `A7@4`, `A7@2+1/2`          | a chord on beat 4, or half a beat after beat 2                                                           |
| `\|:`, `:\|`, `:\|x3`       | a repeat starts, ends, ends after three passes                                                           |
| `\|1`, `\|1,2`, `:\|2`      | an ending starts, for pass 1 (or 1 and 2); a repeat ends and ending 2 starts                             |
| `\|\|`                      | a double bar: it closes an ending                                                                        |
| `<Segno>`, `<Coda>`         | the sign a D.S. goes back to, and where the coda starts (at the start of the bar)                        |
| `<To Coda>`, `<Fine>`       | where the play goes to the coda, or ends, after a jump (at the end of the bar)                           |
| `<D.C.>`, `<D.S. al Coda>`… | a jump at the end of the bar: `D.C.` or `D.S.`, alone or `al Fine` or `al Coda`                          |

A beat is the meter's lower note, as in [`Time.fromBarBeat`](/packages/time): in 6/8, `G7@4` is on the second dotted quarter.

Bar lines with only spaces between them are one bar line (`:| |2` is `:|2`, `|| |:` is `||:`), except two plain ones: `| |` is an empty bar.

### Where chords start in a bar

Chords without `@` are placed by the meter's pulses (the groups it's felt in, from [`Time.meter`](/packages/time)), the way a musician reads a chart: with n chords in p pulses, each chord gets `floor(p / n)` pulses and the first `p mod n` chords one more. More chords than pulses split the bar equally.

| Bar              | Chords start at (quarters)   |
| ---------------- | ---------------------------- |
| `\| C F \|`      | 0, 2                         |
| `\| C F G \|`    | 0, 2, 3 (2 + 1 + 1 beats)    |
| `3/4 \| C F \|`  | 0, 2                         |
| `6/8 \| C F \|`  | 0, 3/2 (two dotted quarters) |
| `\| Em7 A7@4 \|` | 0, 3                         |

In a bar where some chords have `@`, a chord without it starts on beat 1 if it's first, or on the next pulse after the chord before.

### `Chart.fromForm`

`fromForm(sections: Record<string, string>, form: string, options?: { meter?: string }) => Chart`

A chart from named sections and a form: the sections in the order the form lists them, each starting with its name. The form is names separated by spaces, with `*n` to play one n times; `"AABA"` is read letter by letter when there's no section with that name. Each section is read on its own (from `options.meter`, 4/4 by default), so it keeps its meter wherever it's played, and it can have its own repeats and jumps.

```js
const chart = Chart.fromForm({ A: "| C | G |", B: "| F |" }, "A A B A");
Chart.unroll(chart).map((b) => `${b.section}${b.sectionBar}`);
// => ["A0", "A1", "A0", "A1", "B0", "A0", "A1"]

Chart.fromForm(
  { Intro: "| Am | D7 |", A: "| C | G |", B: "3/4 | F | E7 |" },
  "Intro A*2 B A",
);
```

A name that isn't a section gives an empty chart, and `Chart.problems` says which. Problems inside a section are listed with its name.

### `Chart.toText`

`toText(chart: Chart) => string`

Write a chart back as text, so that `Chart.parse` gives the same chart. Each section starts a line, a line has at most four bars, meters are written where they change, and positions (`@`) only where the chords aren't where the split rule would put them:

```js
Chart.toText(Chart.parse("[A] |: C | G7 :| [B] | F |")); // => "[A] |: C | G7 :|\n[B] | F |"
```

### `Chart.transpose`

`transpose(chart: Chart, interval: string) => Chart`

Transpose the chords of a chart, keeping its sections, meters, repeats, jumps and positions (`N.C.` stays):

```js
Chart.toText(
  Chart.transpose(Chart.parse("[A] |: Dm7 G7 |1 Cmaj7 :|2 Cmaj7 C7 ||"), "-5P"),
);
// => "[A] |: Gm7 C7 |1 Fmaj7 :|2 Fmaj7 F7 ||"
```

### `Chart.problems`

`problems(chart: Chart) => string[]`

What can't be played, by bar: the words, chord symbols, meters and positions the parser couldn't read (those are left out), and repeats and endings that don't close (a chart with those unrolls to `[]`). An empty list means the chart is fine.

```js
Chart.problems(Chart.parse("| Cmaj7 | Xyz |")); // => ['bar 2: unknown word "Xyz"']
```

## The played form

### `Chart.unroll`

`unroll(chart: Chart, options?: { choruses?: number }) => PlayedBar[]`

The bars in the order they're played, each with its index in the chart (`bar`), its `index` in the played form, where it starts (`start`, quarter notes from the start), its `duration`, its `meter`, its `section`, its place in the section (`sectionBar` from 0, and `sectionLength`), its `chorus` and its `pass`. `choruses` plays the form more than once.

```js
const chart = Chart.parse("[A] | Dm7 G7 | Cmaj7 |\n[B] | Fmaj7 | 3/4 E7 |");
Chart.unroll(chart).map((b) => [
  b.section,
  b.sectionBar,
  b.sectionLength,
  b.start,
  b.meter,
]);
// => [["A", 0, 2, [0, 1], "4/4"], ["A", 1, 2, [4, 1], "4/4"], ["B", 0, 2, [8, 1], "4/4"], ["B", 1, 2, [12, 1], "3/4"]]
```

A run of a section starts at a bar that starts a section (`[A]`), or at a new chorus, so the places count within it: an AABA form is four runs, whether the A sections are written out or repeated. Fills and endings in an app usually go on the last bar of a run.

### Repeats and endings

`unroll` plays repeats and endings as a musician reads them. Each played bar has its `pass` through the repeat (1 outside repeats) and, in an ending, its `ending`:

```js
Chart.unroll(Chart.parse("|: C |1 G :|2 F |")).map((b) => [
  b.bar,
  b.pass,
  b.ending,
]);
// => [[0, 1, undefined], [1, 1, 1], [0, 2, undefined], [2, 2, 2]]
```

- `:|` goes back to its `|:`; without one, to the start of the chart or to the bar after the `:|` before. It plays 2 passes, `:|x3` three, and as many as the highest ending: `|: A |1,2 B :|3 C |` plays A B A B A C.
- On each pass, the ending for that pass is played and the others are skipped. When no ending is for the pass, the last ending is played if it doesn't repeat; otherwise the endings are skipped, so `|: A |1 B :| C |` plays A B A C.
- An ending with its own `:|` ends there. The last ending lasts until a `||`, or one bar: in `|: A |1 B :|2 C | D || E |` the second ending is C and D.
- Repeats don't nest: a `|:` inside a repeat, a `|:` without a `:|` and an ending without any `:|` are problems.

### Jumps: D.C., D.S., coda and fine

After the bar with a D.C., the play goes back to the start; after a D.S., to the `<Segno>`. Then it goes on to the end, stops after the `<Fine>` (al Fine), or jumps from the end of the `<To Coda>` bar to the `<Coda>` (al Coda). `<Fine>` and `<To Coda>` count only after the jump.

```js
const order = (text, options) => {
  const chart = Chart.parse(text);
  return Chart.unroll(chart, options).map(
    (b) => chart.bars[b.bar].chords[0].value,
  );
};
order("| C <Fine> | F | G <D.C. al Fine> |"); // => ["C", "F", "G", "C"]
order("| Dm | <Segno> C | F <To Coda> | G <D.S. al Coda> | <Coda> Am |");
// => ["Dm", "C", "F", "G", "C", "F", "Am"]
```

- After the jump, repeats aren't taken and only the last ending is played (or none, if it repeats), as most players read it: `| C |: D |1 E :|2 F | G <D.C.> |` plays C D E D F G C D F G. `repeatsOnJump: true` takes the repeats again.
- **Choruses: the coda ends the tune.** With `choruses: n` and an `al Coda` or `al Fine`, the part before the jump is played n times (the first time from the start, then from where the jump goes back to, so an intro before the segno is played once), and the jump and the coda (or the Fine) once, at the end of the last chorus. With one chorus, it's the reading above.

  ```js
  order("| C | F <To Coda> | G <D.C. al Coda> | <Coda> Am |", { choruses: 2 });
  // => ["C", "F", "G", "C", "F", "G", "C", "F", "Am"]
  ```

- A plain `<D.C.>` or `<D.S.>` (without `al Fine` or `al Coda`) marks no ending: it's part of the tune, like a written repeat, so each chorus plays the whole tune with its jump.

  ```js
  order("| C | G <D.C.> |", { choruses: 2 }); // => ["C", "G", "C", "G", "C", "G", "C", "G"]
  ```

- `<To Coda>` and `<Coda>` without a jump are read as a D.C. al Coda at the end of the bar before the coda, as in many chart apps: the form loops and ends with the coda.
- One jump, one `<Segno>` and one `<Coda>` per chart. A D.S. without a segno, an `al Coda` without `<To Coda>` and `<Coda>`, an `al Fine` without `<Fine>`, or a mark that its jump doesn't use is a problem, and the chart unrolls to `[]`.

A tune in AABA form with a first and a second ending:

```js
const tune = Chart.parse(
  "[A] |: Cmaj7 | Am7 |1 Dm7 | G7 :|2 Dm7 G7 | Cmaj7 ||\n" +
    "[B] | Em7 | A7 | Dm7 | G7 |\n[A] | Cmaj7 | Am7 | Dm7 G7 | Cmaj7 |",
);
Chart.unroll(tune).length; // => 16
```

### `Chart.chords`

`chords(chart: Chart, options?: { choruses?: number }) => PlayedChord[]`

The chords as they're played: each with its symbol (`value`), its `start` and `duration` in quarter notes from the start of the played form, and its `bar` in the played form. A chord lasts until the next one, or the end of the form. A chord written again is played again (a new entry), and an empty bar continues the chord before.

```js
Chart.chords(Chart.parse("| Dm7 G7 | Cmaj7 |")).map((c) => [
  c.value,
  c.start,
  c.duration,
]);
// => [["Dm7", [0, 1], [2, 1]], ["G7", [2, 1], [2, 1]], ["Cmaj7", [4, 1], [4, 1]]]
```

### `Chart.chordAt`

`chordAt(chords: PlayedChord[], position: TimeValue) => PlayedChord | null`

The chord playing at a position, from the list `Chart.chords` gives. The position is a time value: a fraction, an exact number or a string. A chord plays from its start until the next one starts; before the first chord or after the end, it's `null`.

```js
const chords = Chart.chords(Chart.parse("| Dm7 G7 | Cmaj7 |"));
Chart.chordAt(chords, 3)?.value; // => "G7"
Chart.chordAt(chords, [8, 1]); // => null
```

### `Chart.barAt`

`barAt(played: PlayedBar[], position: TimeValue) => PlayedBar | null`

The played bar at a position, from the list `Chart.unroll` gives: for a playhead, or to know where a note falls in the form (its section, the place in it, the pass, the ending).

```js
const played = Chart.unroll(Chart.parse("[A] |: C |1 G7 :|2 F |"));
const bar = Chart.barAt(played, 9);
[bar.bar, bar.pass, bar.sectionBar]; // => [0, 2, 0]  (the first bar, on the second pass)
Chart.barAt(played, 16); // => null  (after the end)
```

### `Chart.position`

`position(played: PlayedBar[], text: string) => [number, number] | null`

A bar and beat of the played form, in quarter notes: `"9:3"` is beat 3 of the 9th played bar, in that bar's meter.

```js
Chart.position(Chart.unroll(Chart.parse("| C | 3/4 G | F |")), "3:2"); // => [8, 1]
```

## A chart with a rhythm

`Time.onsets` turns a [rhythm pattern](/packages/rhythm-pattern) into positions, so a chart can be accompanied with a rhythm: the onsets in each played bar, and the chord at each one.

```js
const chart = Chart.parse("| Dm7 | G7 | Cmaj7 | % |");
const chords = Chart.chords(chart);
const tresillo = Time.onsets(RhythmPattern.euclid(8, 3), [1, 2]); // [[0, 1], [3, 2], [3, 1]]
Chart.unroll(chart)
  .flatMap((bar) => tresillo.map((at) => Time.add(bar.start, at)))
  .map((position) => Chart.chordAt(chords, position)?.value);
// => ["Dm7", "Dm7", "Dm7", "G7", "G7", "G7", "Cmaj7", "Cmaj7", "Cmaj7", "Cmaj7", "Cmaj7", "Cmaj7"]
```
