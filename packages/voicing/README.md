# @tonaljs/voicing

Contains functions to generate voicings. If you're not sure what voicings are, [watch this video](https://www.youtube.com/watch?v=VR3o45Pwx9Y).

## Usage

ES6:

```js
import { Voicing } from "tonal";
```

Nodejs:

```js
const { Voicing } = require("tonal");
```

## Voicing a chord

A voicing is a list of notes with octave, from the bottom. The symbol says which notes the chord has; the options say how to play them: how many voices, which tensions, who plays the bass, where.

### `Voicing.get`

`get(chord: string, options?: VoicingOptions) => string[]`

By default, the notes of the symbol, in root position, near the middle of the range C3–C5:

```js
Voicing.get("C7"); // => ["C4", "E4", "G4", "Bb4"]
Voicing.get("Dm7"); // => ["D3", "F3", "A3", "C4"]
Voicing.get("C/E"); // => ["E3", "G3", "C4"]
```

Options, for one chord or (in `Voicing.sequence`) a whole progression:

| Option           | Default            | Meaning                                                                                                                                                                                                            |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `voices`         | the symbol's notes | How many voices, or a range for each voice from the bottom: `[["C3", "G4"], ["G3", "C5"]]`                                                                                                                         |
| `extensions`     | `[]`               | Tensions beyond the symbol: degrees (`["9", "13"]`) or `"available"`                                                                                                                                               |
| `bass`           | `"none"`           | Who plays the chord's bass: `"none"` (this voicing), `"root"` (a bass part, the first note) or `"external"` (a bass player: the voicing leaves it out)                                                             |
| `range`          | `["C3", "C5"]`     | The range of the voices                                                                                                                                                                                            |
| `bassRange`      | `["C2", "C3"]`     | The range of the bass part, with `bass: "root"`                                                                                                                                                                    |
| `top`            |                    | A fixed top note (a melody note) or a range for it                                                                                                                                                                 |
| `degrees`        |                    | Exactly these degrees: `["3", "7", "9"]`. A plain number is the chord's own degree (`"3"` is the b3 of a minor chord)                                                                                              |
| `previous`       |                    | The voicing before: choose the closest                                                                                                                                                                             |
| `metric`         | `"L1"`             | How to measure the voice leading from `previous` (see [VoiceLeading](../voice-leading))                                                                                                                            |
| `anchor`, `mode` |                    | Place the voicing against a note, without context: `"below"` (top note at or below it), `"duck"` (below it, without it), `"above"` (bottom note at or above it), `"root"` (the root at the bottom, at or above it) |
| `lowIntervals`   | `true`             | Skip voicings below the low interval limits                                                                                                                                                                        |

```js
Voicing.get("C7", { voices: 3 }); // => ["C4", "E4", "Bb4"]
Voicing.get("C13", { voices: 4 }); // => ["C4", "E4", "A4", "Bb4"]
Voicing.get("C7", { bass: "root", voices: 3 }); // => ["C2", "Bb3", "E4", "G4"]
Voicing.get("C6", { voices: 5, top: "A4" }); // => ["C3", "E3", "G3", "A3", "A4"]
Voicing.get("Cmaj7", { anchor: "C5" }); // => ["E4", "G4", "B4", "C5"]
```

Rootless jazz voicings, with a bass player and the available tensions, each chord led from the previous one:

```js
const jazz = { voices: 4, extensions: "available", bass: "external" };
Voicing.get("Dm7", jazz); // => ["F3", "A3", "C4", "E4"]
Voicing.get("G7", { ...jazz, previous: ["F3", "A3", "C4", "E4"] }); // => ["F3", "A3", "B3", "E4"]
```

It returns `[]` if the chord is not valid or no voicing fits.

### `Voicing.search`

`search(chord: string, options?: VoicingOptions) => string[][]`

Every voicing that fits the options, best first. `Voicing.get` is its first result.

```js
Voicing.search("C").slice(0, 2); // => [["C4", "E4", "G4"], ["C3", "E3", "G3"]]
```

### `Voicing.sequence`

`sequence(chords: (string | { chord: string, ...options })[], options?: VoicingOptions & { maxLeap?: number }) => string[][]`

A voicing for each chord of a progression: the smoothest path through the voicings `Voicing.search` gives for each chord, so the voices move as little as possible over the whole progression. It's an exact path, not a greedy one: a choice that would force large moves later is avoided.

```js
Voicing.sequence(["C", "Am", "F", "G"]);
// => [["C4", "E4", "G4"], ["C4", "E4", "A4"], ["C4", "F4", "A4"], ["B3", "D4", "G4"]]
Voicing.sequence(["Dm7", "G7", "Cmaj7"], {
  voices: 4,
  extensions: "available",
  bass: "external",
});
// => [["F3", "A3", "C4", "E4"], ["F3", "A3", "B3", "E4"], ["E3", "G3", "B3", "D4"]]
Voicing.sequence(["Dm7", "G7", "Cmaj7"], {
  voices: 3,
  bass: "root",
  extensions: "available",
});
// => [["D2", "F3", "C4", "E4"], ["G2", "F3", "B3", "E4"], ["C3", "E3", "B3", "D4"]]
```

- **Options.** The options are the ones of `Voicing.get`, for every chord. A chord can be an object with its own options, which are merged over them (all of them except `previous` and `metric`, which belong to the whole sequence):

  ```js
  Voicing.sequence(["Dm7", { chord: "G7", voices: 5 }, "Cmaj7"], { voices: 4 });
  ```

- **What each step costs:** the voice-leading distance from the voicing before (`metric`, see [VoiceLeading.path](../voice-leading)), plus the voicing's own cost (register and spacing, see the rules below). So the progression doesn't drift away from the range.
- **Root position:** only the first chord prefers it, and only when there's no `previous` (the voicing before the first chord).
- **`maxLeap`:** the largest move of a voice, in semitones. A voicing that needs a larger move is skipped, unless every voicing of its chord does.
- **Chords without voicings** give `[]`, and the next chord is led from the last one.

### The rules

1. **Tones.** The notes of the symbol. With fewer `voices`, the least important go first: the root and the natural 5th; the 3rd and the 7th stay, and so does the tension that names the chord (the 13 of a 13 chord). See `Chord.degreesByImportance`.
   - `extensions: "available"` adds the tensions of the chord's family, each with a role:

     | Family              | Replaces the root | Replaces the 5th | Extra, if there are voices left                |
     | ------------------- | ----------------- | ---------------- | ---------------------------------------------- |
     | major               | 9                 |                  | 13                                             |
     | minor               | 9                 |                  | 11                                             |
     | dominant, suspended | 9                 | 13               |                                                |
     | altered dominant    | b9 or #9          | b13 or #5        | #11                                            |
     | half-diminished     | (the root stays)  |                  | 11, 9                                          |
     | diminished          | (the root stays)  |                  | the notes a whole step above: maj7, 11, b13, 9 |

     A tension never takes the place of a chord tone it doesn't replace, and an altered tension excludes its natural one (no 9 with a b9).

   - When a bass part or a bass player has the root, the voicing leaves it out (except in half-diminished and diminished chords).
   - When the 3rd and the 7th tie for the last voice, both are tried, and so are the root slot and the 5th slot: the choice below picks the "A" or "B" form.
   - More voices than tones double the top note an octave below (with a fixed `top`), then the root, then the 5th.
2. **Placement.** Every arrangement inside the range (or the range of each voice), with:
   - neighbour voices at most an octave apart, and the lowest two at most a 10th;
   - the top note and the slash bass where asked;
   - no interval below the low interval limits: measured from the root (or an "imaginary root" below the lowest note) to the next note up, a major 3rd can't be lower than Bb2–D3, a minor 3rd than C3–Eb3, a 5th than Bb1–F2, and so on.
3. **Cost**, lower first:
   - **context:**
     - with `previous`: the voice-leading distance (1 per semitone);
     - with `anchor`: the distance of the top note (`below`, `duck`) or the bottom note (`above`, `root`) from it;
     - otherwise: 0.25 per semitone between the voicing's average note and the middle of the range, plus 12 when the chord's bass isn't at the bottom.
   - **spacing:** 1 per chord step beyond close position between neighbour voices (C4 E4 G4 is close; C4 G4 E5 is two extra steps).
   - **sound:**
     - 3 per minor 9th between two notes, except the root under a b9 on a dominant;
     - 2 per tension right below a chord tone more than a whole step away;
     - 6 when the root is played elsewhere and the lowest voice isn't the 3rd or the 7th.
4. **Ties:** the lower voicing, then the lower notes.

The weights are tonal's own starting values, checked against the voicings of jazz piano method books.

### Sources

- Mark Levine, _The Jazz Piano Book_ (1989), chs. 7 and 19: rootless "A" and "B" voicings (3rd or 7th at the bottom); doubling the melody in block chords.
- Phil DeGreg, _Jazz Keyboard Harmony_ (1994), chs. 3–7: shells with extensions, three- and four-note rootless voicings, the root kept in m7b5 and dim7 voicings.
- Rawlins & Bahha, _Jazzology_ (2005), pp. 67–69: rootless voicings; "the 5th is often replaced by the 13th" on dominants.
- John Novello, _The Contemporary Keyboardist_ (1986): tension substitutions (the 9 for the root, the 13 for the 5th).
- Bill Dobbins, _The Contemporary Jazz Pianist_, vol. 2, p. 11: the 3rd and the 7th carry the quality; extensions don't sit far below chord tones; avoid unnecessary doubling.
- Tim Richards, _Exploring Jazz Piano_, vol. 1, p. 223: doubling the melody an octave below.
- Gary Lindsay, _Jazz Arranging Techniques_ (2005), ch. 12, pp. 93–94 (low interval limits) and ch. 16 (spread voicings: the lowest interval up to a 10th).
- Dmitri Tymoczko, _Tonality: An Owner's Manual_ (2023), prelude to ch. 2: a voicing is a pattern of spacing measured in steps along the chord.

## Legacy: dictionary voicings (deprecated)

Before tonal 6.10, `Voicing` took voicings from a small dictionary (`VoicingDictionary`). That form still works when the second argument is a range array, or with more than two arguments, and will be removed in tonal 7:

> **Migration (tonal 6.10):** `Voicing.get(chord)`, `Voicing.search(chord)` and `Voicing.sequence(chords)` without a range now use the rules above, so their results change: `Voicing.get("Dm7")` was `["F3", "A3", "C4", "E4"]` (a rootless voicing from the dictionary) and is now `["D3", "F3", "A3", "C4"]`. For the old results, pass the range: `Voicing.get("Dm7", ["C3", "C5"])`. For rootless jazz voicings with the new rules, use `{ voices: 4, extensions: "available", bass: "external" }`.

> **Migration (tonal 6.7):** `get` now returns `[]` when no voicing is found; check `voicing.length === 0` instead of `!voicing` or `??`. `search` without a dictionary now searches `VoicingDictionary.all` (it was `VoicingDictionary.triads`), so it returns more results.

### Voicing.search (legacy)

```ts
Voicing.search(chord: string, range?: [string, string], dictionary?: VoicingDictionary): string[][]
```

This method returns all possible voicings of the given chord, inside the given range, as defined in the dictionary:

```ts
Voicing.search("C^7", ["E3", "D5"], { "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"] });
/* => [
  ['E3', 'G3', 'B3', 'D4'],
  ['E4', 'G4', 'B4', 'D5'],
  ['B3', 'D4', 'E4', 'G4'],
] */
```

The VoicingDictionary param uses the format of [@tonaljs/voicing-dictionary](../voicing-dictionary). Instead of defining your own, you could also use an existing dictionary from there:

```ts
import { VoicingDictionary } from "@tonaljs/voicing-dictionary";
Voicing.search("C^7", ["E3", "D5"], VoicingDictionary.lefthand);
/* => [
  ['E3', 'G3', 'B3', 'D4'],
  ['E4', 'G4', 'B4', 'D5'],
  ['B3', 'D4', 'E4', 'G4'],
] */
```

If no range and/or dictionary is given, the range is `["C3", "C5"]` and the dictionary is `VoicingDictionary.all` (the same defaults as `Voicing.get`):

```ts
Voicing.search("C^7");
/* => [
  ['E3', 'G3', 'B3', 'D4'],
  ['B3', 'D4', 'E4', 'G4'],
] */
```

If the dictionary has no voicing for the chord, it returns an empty array:

```ts
Voicing.search("C13"); // => []
```

### Voicing.get (legacy)

```ts
Voicing.get(
  chord: string,
  range?: [string, number],
  dictionary?: VoicingDictionary,
  voiceLeading?: VoiceLeading,
  lastVoicing?: string[]
) => string[];
```

Returns the best voicing for **chord** inside the given **range**, as contained in the **dictionary**, using **voiceLeading** to decide which voicing to pick after **lastVoicing**. Internally calls Voicing.search to generate the available voicings:

```ts
Voicing.get("Dm7");
/* ['F3', 'A3', 'C4', 'E4']); */
Voicing.get("Dm7", ["F3", "A4"], lefthand, topNoteDiff);
/* ['F3', 'A3', 'C4', 'E4']; */
const last = ["C4", "E4", "G4", "B4"];
Voicing.get("Dm7", ["F3", "A4"], lefthand, topNoteDiff, last);
/* ['C4', 'E4', 'F4', 'A4']; */ // => A4 is closest to B4
```

If no voicing is found, it returns an empty array (before 6.7 it returned `undefined`), so check `voicing.length === 0` instead of `!voicing` or `??`:

```ts
Voicing.get("C13"); // => []
```

### Voicing.sequence (legacy)

```ts
Voicing.sequence(
  chords: string[],
  range?: [string, string],
  dictionary?: VoicingDictionary,
  voiceLeading?: VoiceLeading,
  lastVoicing?: string[]
) => string[][];
```

Returns one voicing for each chord, each one picked with **voiceLeading** from the previous one (calls `Voicing.get` for each chord). A chord without voicing gives an empty array at its position, and the next chord is voice-led from the last chord that had a voicing:

```ts
Voicing.sequence(["C", "F", "G"], ["F3", "A4"], triads, topNoteDiff);
/* => [
  ['C4', 'E4', 'G4'],
  ['A3', 'C4', 'F4'],
  ['B3', 'D4', 'G4'],
] */
Voicing.sequence(["C", "C13", "F"], ["F3", "A4"], triads);
/* => [
  ['C4', 'E4', 'G4'],
  [],
  ['A3', 'C4', 'F4'],
] */
```
