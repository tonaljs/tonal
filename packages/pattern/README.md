# @tonaljs/pattern ![tonal](https://img.shields.io/badge/@tonaljs-pattern-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pattern.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pattern)

> Note patterns: arpeggio orders and melodic sequences as lists of indexes

A note pattern says **which notes, in which order**: arpeggio orders (up, up-down, converge, thumb…) and melodic sequences (groups of four through a scale, thirds, 1-2-3-5). It doesn't say when they sound: that's a rhythm, and [`RhythmPattern`](/packages/rhythm-pattern) builds those.

A pattern is a list of indexes into a list of notes (a chord, a voicing, a scale), so the same pattern plays over any chord or scale:

```js
import { Chord, Pattern, Scale } from "tonal";

Pattern.arpeggio("up-down", 4); // => [0, 1, 2, 3, 2, 1]
Pattern.arpeggio("up-down", 4).map(Chord.steps(["C4", "maj7"]));
// => ["C4", "E4", "G4", "B4", "G4", "E4"]

Pattern.sequence([0, 1, 2, 4], 1, 3).flat().map(Scale.steps("C4 major"));
// => ["C4", "D4", "E4", "G4", "D4", "E4", "F4", "A4", "E4", "F4", "G4", "B4"]
```

## Usage

ES6:

```js
import { Pattern } from "tonal";
```

node:

```js
const { Pattern } = require("tonal");
```

single module:

```js
import { arpeggio, sequence } from "@tonaljs/pattern";
```

## Indexes and notes

The functions here only make and change lists of numbers. Turning an index into a note is the job of the notes it's played over, read as a loop that repeats every octave: over n notes, index `i` is note `i mod n`, `floor(i / n)` octaves up, and negative indexes go down.

- Over a scale: `Scale.steps("C4 major")`. Index 7 is `C5`, index -1 is `B3`.
- Over a chord: `Chord.steps(["C4", "maj7"])`. Index 4 is `C5`.
- Over a voicing: `Voicing.steps(["C3", "G3", "E4"])`. Index 3 is `C5`: past the top voice, the voicing repeats above itself.

To keep the notes in a register, fold them with [`Note.fold`](/packages/note#notefold).

Indexes count from 0, like every index in tonal: the 1-2-3-5 of the books is `[0, 1, 2, 4]`. A list counted from 1 plays over a scale with `Scale.degrees` instead:

```js
[0, 1, 2, 4].map(Scale.steps("D4 major")); // => ["D4", "E4", "F#4", "A4"]
[1, 2, 3, 5].map(Scale.degrees("D4 major")); // => ["D4", "E4", "F#4", "A4"]
```

A pattern only means something together with the notes it's played over: the same four notes are `[0, 1, 2, 3]` over D major pentatonic.

## Arpeggios

### `Pattern.arpeggio`

`arpeggio(name: string, n: number) => number[]`

An arpeggio order over n notes, once round the loop. Index 0 is the lowest note and n - 1 the highest; every index is in that range. The order adapts to the number of notes (`"up"` is 3 notes over a triad, 4 over a seventh chord), unlike a sequence's cell, which has the same length over any notes:

| Name               | What it plays                                                          | n = 3       | n = 4                   |
| ------------------ | ---------------------------------------------------------------------- | ----------- | ----------------------- |
| `up`               | lowest to highest                                                      | 0 1 2       | 0 1 2 3                 |
| `down`             | highest to lowest                                                      | 2 1 0       | 3 2 1 0                 |
| `up-down`          | up and back, each end once (2n - 2 notes)                              | 0 1 2 1     | 0 1 2 3 2 1             |
| `down-up`          | down and back, each end once (2n - 2)                                  | 2 1 0 1     | 3 2 1 0 1 2             |
| `up-down-repeat`   | up and back, each end twice (2n)                                       | 0 1 2 2 1 0 | 0 1 2 3 3 2 1 0         |
| `down-up-repeat`   | down and back, each end twice (2n)                                     | 2 1 0 0 1 2 | 3 2 1 0 0 1 2 3         |
| `converge`         | lowest, highest, second lowest, second highest…                        | 0 2 1       | 0 3 1 2                 |
| `diverge`          | converge backwards: ends on the lowest                                 | 1 2 0       | 2 1 3 0                 |
| `converge-diverge` | converge and back, like up-down (2n - 2)                               | 0 2 1 2     | 0 3 1 2 1 3             |
| `thumb-up`         | the lowest note before each note above it, upwards (2n - 2)            | 0 1 0 2     | 0 1 0 2 0 3             |
| `thumb-up-down`    | the lowest note before each note above it, up and down (4n - 8)        | 0 1 0 2     | 0 1 0 2 0 3 0 2         |
| `pinky-up`         | the highest note after each note below it, upwards (2n - 2)            | 0 2 1 2     | 0 3 1 3 2 3             |
| `pinky-up-down`    | the highest note after each note below it, up and down (4n - 8)        | 0 2 1 2     | 0 3 1 3 2 3 1 3         |

The orders that go "and back" play each end once, so the loop doesn't repeat a note when it starts again (`0 1 2 1 | 0 1 2 1`); the `-repeat` orders play each end twice. Over one note every order is `[0]`, over two notes they're `[0, 1]` or `[1, 0]` (or `[0, 1, 1, 0]` and `[1, 0, 0, 1]` with repeated ends). It returns `[]` for 0 notes, an unknown name or a count that isn't a non-negative integer.

```js
Pattern.arpeggio("converge", 4); // => [0, 3, 1, 2]
Pattern.arpeggio("thumb-up", 4); // => [0, 1, 0, 2, 0, 3]

Pattern.arpeggio("pinky-up", 4).map(Voicing.steps(["E3", "G3", "B3", "D4"]));
// => ["E3", "D4", "G3", "D4", "B3", "D4"]
```

To play the notes as they were played, not from low to high, give them in that order and use `"up"`.

### `Pattern.arpeggios`

`arpeggios() => string[]`

The names of the arpeggio orders:

```js
Pattern.arpeggios();
// => ["up", "down", "up-down", "down-up", "up-down-repeat", "down-up-repeat", "converge", "diverge", "converge-diverge", "thumb-up", "thumb-up-down", "pinky-up", "pinky-up-down"]
```

### Arpeggios over more octaves

There are two ways to spread an arpeggio over more octaves, and they give different orders for anything but `"up"`. Both come from the functions here. With a triad over two octaves, indexes 3 to 5 are the triad an octave up:

- **Expand first**: the order over all the notes of every octave (3 × 2):

  ```js
  Pattern.arpeggio("up-down", 3 * 2); // => [0, 1, 2, 3, 4, 5, 4, 3, 2, 1]
  Pattern.arpeggio("up-down", 3 * 2).map(Chord.steps(["C4", "M"]));
  // => ["C4", "E4", "G4", "C5", "E5", "G5", "E5", "C5", "G4", "E4"]
  ```

- **Order per octave**: the triad's order, played in each octave in turn (a sequence with a step of 3 notes):

  ```js
  Pattern.sequence(Pattern.arpeggio("up-down", 3), 3, 2).flat();
  // => [0, 1, 2, 1, 3, 4, 5, 4]
  Pattern.sequence(Pattern.arpeggio("up-down", 3), 3, 2)
    .flat()
    .map(Chord.steps(["C4", "M"]));
  // => ["C4", "E4", "G4", "E4", "C5", "E5", "G5", "E5"]
  ```

## Sequences

### `Pattern.sequence`

`sequence(cell: number[], step: number, count: number) => number[][]`

A melodic sequence: a cell of indexes, moved by a step, again and again. Group i is the cell with i × step added to each index, so the cell keeps its shape and moves through the notes it's played over (through a scale, it moves diatonically). It returns the groups, as the books print them; `.flat()` gives one list. A negative step moves the cell down, and a step of 0 repeats it:

```js
Pattern.sequence([0, 1, 2, 3], 1, 3);
// => [[0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5]]

// groups of four through a pentatonic
Pattern.sequence([0, 1, 2, 3], 1, 3).flat().map(Scale.steps("C4 major pentatonic"));
// => ["C4", "D4", "E4", "G4", "D4", "E4", "G4", "A4", "E4", "G4", "A4", "C5"]

// triads on each degree
Pattern.sequence([0, 2, 4], 1, 3).map((group) => group.map(Scale.steps("C4 major")));
// => [["C4", "E4", "G4"], ["D4", "F4", "A4"], ["E4", "G4", "B4"]]

// groups of four, down from the top
Pattern.sequence([7, 6, 5, 4], -1, 3).flat().map(Scale.steps("C4 major"));
// => ["C5", "B4", "A4", "G4", "B4", "A4", "G4", "F4", "A4", "G4", "F4", "E4"]
```

It returns `[]` if the cell is empty or has a number that isn't an integer, or if the step isn't an integer or the count isn't a non-negative integer.

Sources: Tim Richards, _Exploring Jazz Piano_, vol. 1, Figs 3.12-3.13 (groups of three and four notes, and thirds, through a scale) and Figs 5.5-5.10 (the same patterns over a pentatonic); Jerry Coker, _The Teaching of Jazz_, "digital patterns" (small groups such as 1-2-3-1, 1-2-3-5, 1-3-5-3, moved to each passing chord).

### `Pattern.alternate`

`alternate(groups: number[][]) => number[][]`

Reverse every other group, starting with the second. A sequence of thirds becomes thirds alternately up and down:

```js
Pattern.alternate([[0, 2], [1, 3], [2, 4], [3, 5]]);
// => [[0, 2], [3, 1], [2, 4], [5, 3]]
Pattern.alternate(Pattern.sequence([0, 2], 1, 4)).flat().map(Scale.steps("C4 major"));
// => ["C4", "E4", "F4", "D4", "E4", "G4", "A4", "F4"]
```

Sources: Tim Richards, _Exploring Jazz Piano_, vol. 1, Fig 5.11 (pentatonic "thirds" alternately up and down, "obtained by reversing the direction of every other pair of notes").

### `Pattern.repeat`

`repeat(indexes: number[], times: number) => number[]`

Repeat each index a number of times, in place. Over an arpeggio, it gives the doubled orders:

```js
Pattern.repeat([0, 1, 2], 2); // => [0, 0, 1, 1, 2, 2]
Pattern.repeat(Pattern.arpeggio("up", 3), 2); // => [0, 0, 1, 1, 2, 2]
```

To repeat the whole list, use `sequence` with a step of 0: `Pattern.sequence([0, 2, 1], 0, 2).flat()` is `[0, 2, 1, 0, 2, 1]`.

## More with plain arrays

Other changes are one line of plain JavaScript or another tonal function:

```js
// retrograde: the cell backwards
[0, 1, 2, 4].reverse(); // => [4, 2, 1, 0]

// inversion: the cell upside down (realise it from a higher note)
[0, 1, 2, 4].map((i) => -i).map(Scale.steps("C5 major")); // => ["C5", "B4", "A4", "F4"]

// start later in the order: RhythmPattern.rotate takes any list of numbers,
// so note patterns and rhythms rotate the same way
RhythmPattern.rotate(Pattern.arpeggio("up", 4), 1); // => [3, 0, 1, 2]

// the 24 orders of a cell
Array.permutations([0, 1, 2, 4]).length; // => 24

// a real sequence (moved by an interval, not through the scale): transpose the notes
[0, 1, 2, 4].map(Scale.steps("C4 major")).map(Note.transposeBy("m3"));
// => ["Eb4", "F4", "G4", "Bb4"]
```

## With rhythm patterns

A note pattern and a rhythm pattern are independent: one says which notes, the other when. Put the notes on the onsets of a rhythm:

```js
const notes = Pattern.arpeggio("up-down", 3).map(Chord.steps(["C4", "M"]));
const onsets = RhythmPattern.toOnsets(RhythmPattern.euclid(8, 3)); // => [0, 3, 6]
onsets.map((step, i) => [step, notes[i % notes.length]]);
// => [[0, "C4"], [3, "E4"], [6, "G4"]]
```
