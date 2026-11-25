# @tonaljs/voice-leading

Measure how far the voices move between two chords, and find the smoothest path through the voicings of a progression. Used by [@tonaljs/voicing](../voicing).

## Usage

ES6:

```js
import { VoiceLeading } from "tonal";
```

Nodejs:

```js
const { VoiceLeading } = require("tonal");
```

## Distance between voicings

### `VoiceLeading.get`

`get(from: string[], to: string[], options?: { metric }) => { distance: number | null, moves: [string, string][] }`

The smallest voice leading between two voicings (notes with octave): its size and where each voice goes. Each voice goes to the voice in the same position, counting from the bottom:

```js
VoiceLeading.get(["C4", "E4", "G4"], ["B3", "D4", "G4"]);
// => { distance: 3, moves: [["C4", "B3"], ["E4", "D4"], ["G4", "G4"]] }
```

When one voicing has fewer notes, some of its notes are doubled, as few as needed so both have the same number of voices, choosing the doublings that give the smallest voice leading:

```js
VoiceLeading.get(["C4", "E4", "G4"], ["C4", "E4", "G4", "B4"]);
// => { distance: 4, moves: [["C4", "C4"], ["E4", "E4"], ["G4", "G4"], ["G4", "B4"]] }
```

It returns `{ distance: null, moves: [] }` if a voicing is empty or has a note without octave.

### `VoiceLeading.distance`

`distance(from: string[], to: string[], options?: { metric }) => number | null`

The size of the smallest voice leading. The `metric` says how to add up the moves of the voices:

- `"L1"` (default): the sum of the semitones each voice moves
- `"L2"`: the square root of the sum of their squares (Euclidean)
- `"Linf"`: the largest move of any voice

```js
VoiceLeading.distance(["C4", "E4", "G4"], ["B3", "D4", "G4"]); // => 3
VoiceLeading.distance(["C4", "E4", "G4"], ["B3", "D4", "G4"], {
  metric: "Linf",
}); // => 2
VoiceLeading.distance(["C4", "E4"], ["C"]); // => null
```

### `VoiceLeading.pcDistance`

`pcDistance(from: string[], to: string[], options?: { metric }) => number | null`

The same between sets of pitch classes, without octaves: each voice moves the shortest way to its new pitch class. Notes with octave are read as their pitch class, and repeated pitch classes count once. Use `Chord.notes` to compare chord symbols:

```js
VoiceLeading.pcDistance(["C", "E", "G"], ["C", "E", "A"]); // => 2
VoiceLeading.pcDistance(Chord.notes("C"), Chord.notes("Em")); // => 1
VoiceLeading.pcDistance(Chord.notes("Dm7"), Chord.notes("G7")); // => 3
```

The neo-Riemannian moves P (C to Cm) and L (C to Em) have size 1, and R (C to Am) has size 2.

## The smoothest path

### `VoiceLeading.path`

`path(candidates: string[][][], options?: { metric, previous, maxLeap, costs }) => { voicings: string[][], cost: number, steps: number[] }`

Given the candidate voicings of each chord, choose one per chord so the total voice-leading distance is the smallest possible. The path is exact (dynamic programming), not greedy: an early choice that would force large moves later is avoided.

```js
VoiceLeading.path([
  [["C4", "E4", "G4"]],
  [
    ["F4", "A4", "C5"],
    ["C4", "F4", "A4"],
  ],
  [
    ["G4", "B4", "D5"],
    ["B3", "D4", "G4"],
  ],
]);
// => { voicings: [["C4", "E4", "G4"], ["C4", "F4", "A4"], ["B3", "D4", "G4"]], cost: 9, steps: [0, 3, 6] }
```

- `cost` is the total, and `steps` the cost added at each chord.
- On a tie, the first candidate in the list wins, so the order of the candidates is a preference.
- A chord without valid candidates gets `[]`, and the next chord is led from the last voicing.

Options:

- `metric`: as in `distance`.
- `previous`: the voicing before the first chord.
- `maxLeap`: the largest move of a voice, in semitones. A candidate that needs a larger move is skipped, unless every candidate of its chord does.
- `costs`: the cost of each candidate itself, added to the voice-leading cost (same shape as the candidates).

Any list of candidates works, so `path` can lead your own voicing tables, or voicings for other instruments, as well as the ones from `Voicing`.

## Sources

- Dmitri Tymoczko, _A Geometry of Music_ (Oxford, 2011):
  - §2.5: a voice leading maps the notes of one chord to the notes of another; doublings are allowed (a "non-bijective" voice leading, §4.9). In pitch-class space each voice takes the shortest path.
  - §2.7 and Appendix A: the size of a voice leading. The sum of the moves (taxicab), the Euclidean size and the largest move are all reasonable measures, so tonal lets you choose.
  - §4.9: removing voice crossings never makes a voice leading larger. So matching the notes in order from the bottom gives the smallest voice leading between voicings, and between pitch-class sets only the rotations of one chord against the other need to be tried.
  - §2.8: efficient voice leading as a short path between chords.
- Andrew Viterbi, "Error bounds for convolutional codes and an asymptotically optimum decoding algorithm" (1967): the dynamic programming behind `path`.

## Voice leading functions

### `VoiceLeading.topNoteDiff`

A `VoiceLeadingFunction`, used by `Voicing.get` and `Voicing.sequence`: it picks the voicing whose top note is closest to the top note of the last voicing (the first of them on a tie), and `[]` if there are no voicings.

```js
VoiceLeading.topNoteDiff(
  [
    ["F3", "A3", "C4", "E4"], // top note = E4
    ["C4", "E4", "F4", "A4"], // top note = A4
  ],
  ["C4", "E4", "G4", "B4"], // top note = B4
);
// => ["C4", "E4", "F4", "A4"]: A4 is closer to B4 than E4
```

It only looks at the top note. `VoiceLeading.path` measures every voice.
