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
| `spacing`        |                    | Only voicings with this spacing: `"close"`, `"open"`, `"drop2"`, `"drop3"`, `"drop24"`, `"spread"`, `"block"`, or the chord steps between neighbour voices (`[2, 1, 2]`). See [Spacing](#spacing)                  |
| `template`       |                    | A voicing template: a name of the catalogue (`"rootless"`, `"so-what"`…) or chord degrees from the bottom, with `                                                                                                  | ` between the hands (`"R \| 3-7-9"`). See [Templates](#templates) |

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
// => [["C4", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "B3", "D4"]]
Voicing.sequence(["C", "Am", "F", "G"], { bass: "root", voices: 3 });
// => [["C3", "G3", "C4", "E4"], ["A2", "A3", "C4", "E4"], ["F2", "A3", "C4", "F4"], ["G2", "B3", "D4", "G4"]]
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
- **Root position:** a voicing that carries its own bass (`bass: "none"`) is heard from its lowest note, so every chord prefers its bass there: C E A alone sounds like Am/C. The preference is soft, and the voice leading can still choose an inversion when it saves a lot. For triads that invert over a root, use a bass part: `{ bass: "root", voices: 3 }`.
- **`maxLeap`:** the largest move of a voice, in semitones. A voicing that needs a larger move is skipped, unless every voicing of its chord does.
- **Chords without voicings** give `[]`, and the next chord is led from the last one.

### Spacing

How the notes of a voicing are spread is measured in **chord steps**: how many notes of the voicing's own pitch classes there are from one voice up to the next. Close position is one step between neighbours (C4 E4 G4), open position two (C4 G4 E5). The `spacing` option keeps only the voicings with a given spacing:

| Spacing              | Rule                                                                                                                                                                               | Example (Cmaj7)             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `"close"`            | one chord step between neighbours                                                                                                                                                  | C4 E4 G4 B4                 |
| `"open"`             | two chord steps between neighbours (triads)                                                                                                                                        | C3 G3 E4 (C)                |
| `"drop2"`, `"drop3"` | a close voicing with the 2nd or 3rd voice from the top an octave lower                                                                                                             | C3 G3 B3 E4, C3 B3 E4 G4    |
| `"drop24"`           | the 2nd and 4th voices from the top an octave lower                                                                                                                                | C3 G3 E4 B4                 |
| `"spread"`           | the root at the bottom, a wide interval above it (a 5th, 7th or 10th, or a 3rd and then a 4th or more), then intervals from a minor 2nd to a major 6th; more than an octave in all | C3 G3 B3 D4 E4              |
| `"block"`            | close under the top note, with the top note doubled an octave lower                                                                                                                | A3 C4 E4 G4 A4 (C6, top A4) |
| `[2, 1, 2]`          | the chord steps between each pair of neighbour voices                                                                                                                              | D3 A3 C4 F4 (Dm7)           |

```js
Voicing.get("Cmaj7", { spacing: "drop2" }); // => ["C3", "G3", "B3", "E4"]
Voicing.sequence(["Dm7", "G7", "Cmaj7"], { spacing: "drop2" });
// => [["D3", "A3", "C4", "F4"], ["D3", "G3", "B3", "F4"], ["C3", "G3", "B3", "E4"]]
```

### Templates

A template fixes the order of a voicing's notes as chord degrees, from the bottom; each note is the nearest pitch above the one below (after a `|`, the right hand can also start an octave higher). A plain number is the chord's own degree with that number (`3` is the b3 of a minor chord; `7` is the 6th of a sixth chord); `R` is the root. A form whose plain degrees from 1 to 7 the chord doesn't have doesn't apply (no `rootless` voicing of a triad). A chord the template gives nothing for (no form applies, or none fits the range) is voiced by the rules with the same options, so `{ template: "so-what" }` on a ii–V–I gives So What voicings for the minor and major chords and rule voicings for the dominant. An unknown template name gives `[]`. With `voices`, only the forms with that many notes; otherwise the largest forms that fit in the range. Several forms (the "A" and "B" forms) are ranked like any voicing, and in a sequence the voice leading chooses between them.

```js
Voicing.get("Dm7", { template: "rootless" }); // => ["F3", "A3", "C4", "E4"]
Voicing.get("Dm7", { template: "so-what" }); // => ["D3", "G3", "C4", "F4", "A4"]
Voicing.sequence(["Dm7", "G7", "Cmaj7"], { template: "rootless" });
// => [["F3", "A3", "C4", "E4"], ["F3", "A3", "B3", "E4"], ["E3", "G3", "B3", "D4"]]
Voicing.get("Dm7", { template: "R | 3-7-9", range: ["C2", "C5"] }); // => ["D3", "F3", "C4", "E4"]
```

`Voicing.templates()` lists the names. The catalogue has only templates found in two or more independent jazz piano books:

| Template                                                 | Forms                                                                                                                                                                                                                             | Sources                                                                                                                |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `shell`                                                  | `R-3`, `R-7`, `R-3-7`, `R-7-3`                                                                                                                                                                                                    | DeGreg ch. 1; _Jazzology_ p. 67; Richards vol. 1 p. 153; Siskind, _Playing Solo Jazz Piano_                            |
| `guide-tones`                                            | `R \| 3-7`, `R \| 7-3`                                                                                                                                                                                                            | Levine ch. 3; DeGreg ch. 2; _Jazzology_ ch. 4                                                                          |
| `rootless`                                               | major and minor `3-7-9`, `7-3-5`, `3-5-7-9`, `7-9-3-5`; dominant `3-7-9`, `7-3-13`, `3-13-7-9`, `7-9-3-13`; altered `3-#5-7-b9`, `7-b9-3-#5`…; sus `7-9-11-13`, `11-13-7-9`; half-diminished and diminished `3-5-7-R`, `7-R-3-5`… | Levine ch. 7; DeGreg chs. 4 and 6; _Jazzology_ pp. 67–69; Haerle skills 40–45; Richards vol. 2 ch. 7                   |
| `rootless-spread`                                        | `3-7 \| 9-5`, `7-3 \| 5-9` (dominant with 13)                                                                                                                                                                                     | Siskind, _Jazz Band Pianist_ ch. 10; DeGreg ch. 7; Richards vol. 2 fig. 9.16                                           |
| `so-what`                                                | minor `R-11-7 \| 3-5`; major `3-13-9 \| 5-7`, `13-9-5 \| R-3`; sus `5-R-11 \| 7-9`                                                                                                                                                | Levine ch. 12; Haerle skills 48–49; DeGreg ch. 9; _Jazzology_ ch. 6; Richards vol. 2 fig. 6.47                         |
| `fourths`                                                | major `3-13-9`, `3-13-9-5-R`, `7-3-13-9-5`…; minor `R-11-7`, `5-R-11-7-3`…; dominant `7-3-13`, `7-3-13-9-5`, `3-7-9-5-R`; sus `R-11-7`, `5-R-11`                                                                                  | Levine ch. 13; Mantooth ch. 2; DeGreg ch. 8; _Jazzology_ ch. 6; Richards vol. 2 ch. 6                                  |
| `upper-structure` (`-II`, `-bIII`, `-bV`, `-bVI`, `-VI`) | dominants: a major triad on that degree, in any position, over `R-3-7` (`R-3` or `R-7` when the triad has the 7th or the 3rd)                                                                                                     | Levine ch. 14; Haerle skills 109–113; DeGreg p. 216; Mantooth ch. 6; Richards vol. 2 chs. 8–10                         |
| `triad-over-root`                                        | `R \| R-3-5`, `R \| 3-5-7`, `R \| 5-7-9`; sus `R \| 7-9-11`                                                                                                                                                                       | Harrison, _The Pop Piano Book_ ch. 5 and _R&B Keyboard_ ch. 3; DeGreg pp. 217–219; Siskind, _Jazz Band Pianist_ ch. 15 |

Books: Mark Levine, _The Jazz Piano Book_ (1989); Phil DeGreg, _Jazz Keyboard Harmony_ (1994); Rawlins & Bahha, _Jazzology_ (2005); Dan Haerle, _Jazz Piano Voicing Skills_; Tim Richards, _Exploring Jazz Piano_; Frank Mantooth, _Voicings for Jazz Keyboard_; Jeremy Siskind, _Playing Solo Jazz Piano_ and _Jazz Band Pianist_; Mark Harrison, _The Pop Piano Book_ and _R&B Keyboard_.

## Working with voicings

### `Voicing.analyze`

`analyze(notes: string[], chord?: string) => { empty, notes, bass, top, span, steps, spacing, degrees }`

Describe a voicing: its notes from the bottom, the bass and top notes, the span, the chord steps between neighbours, the first named spacing that fits (block, close, open, drop2, drop3, drop24, spread), and, with a chord symbol, the degree of each note:

```js
Voicing.analyze(["G3", "C4", "E4", "B4"], "Cmaj7");
// => { empty: false, notes: ["G3", "C4", "E4", "B4"], bass: "G3", top: "B4", span: "10M", steps: [2, 1, 2], spacing: "drop2", degrees: ["5", "1", "3", "7"] }
```

### `Voicing.invert`

`invert(notes: string[], n: number) => string[]`

Move every voice `n` steps along the voicing's own notes (up for a positive `n`, down for a negative one). In close position it's the usual inversion; in other spacings the voicing keeps its shape, which moving the bass to the top would destroy:

```js
Voicing.invert(["C4", "E4", "G4"], 1); // => ["E4", "G4", "C5"]
Voicing.invert(["C4", "G4", "E5"], 1); // => ["E4", "C5", "G5"]
Voicing.invert(["C4", "E4", "G4"], -1); // => ["G3", "C4", "E4"]
```

### `Voicing.drop`

`drop(notes: string[], n: number | number[]) => string[]`

Lower voices an octave, counting from the top (1 is the top voice). A close voicing with the 2nd voice dropped is a drop 2:

```js
Voicing.drop(["C4", "E4", "G4", "B4"], 2); // => ["G3", "C4", "E4", "B4"]
Voicing.drop(["C4", "E4", "G4", "B4"], [2, 4]); // => ["C3", "G3", "E4", "B4"]
```

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
   - More voices than tones double the top note an octave below (with a fixed `top`), then the root or the 5th: every mix is tried, and the cost chooses. The 3rd and the 7th are not doubled.
2. **Placement.** Every arrangement inside the range (or the range of each voice), with:
   - neighbour voices at most an octave apart, and the lowest two at most a 10th;
   - the top note and the slash bass where asked;
   - no interval below the low interval limits: measured from the root (or an "imaginary root" below the lowest note) to the next note up, a major 3rd can't be lower than Bb2–D3, a minor 3rd than C3–Eb3, a 5th than Bb1–F2, and so on.
3. **Cost**, lower first:
   - **context:**
     - with `previous`: the voice-leading distance (1 per semitone);
     - with `anchor`: the distance of the top note (`below`, `duck`) or the bottom note (`above`, `root`) from it;
     - otherwise: 0.25 per semitone between the voicing's average note and the middle of the range.
   - **root position:** 12 when the voicing carries its own bass (`bass: "none"`) and the chord's bass isn't at the bottom, with or without `previous` (not with an `anchor`, which places the voicing freely).
   - **spacing:** 1 per chord step beyond close position between neighbour voices (C4 E4 G4 is close; C4 G4 E5 is two extra steps).
   - **sound:**
     - 3 per minor 9th between two notes, except the root under a b9 on a dominant;
     - 2 per tension right below a chord tone more than a whole step away;
     - 6 when the root is played elsewhere and the lowest voice isn't the 3rd or the 7th.
4. **Ties:** the lower voicing, then the lower notes.

The weights are tonal's own. They were checked against the 148 voicings of Phil DeGreg's _Jazz Keyboard Harmony_, under the condition of keeping the textbook results of the tests (close position by default, the rootless A/B forms, the pop I–vi–IV–V): no other set of weights did meaningfully better. The book's voicings that the cost doesn't put first are two-handed open voicings, which you get by asking for them (`spacing`, or a template such as `rootless-spread`).

### Sources

- Mark Levine, _The Jazz Piano Book_ (1989), chs. 7 and 19: rootless "A" and "B" voicings (3rd or 7th at the bottom); doubling the melody in block chords.
- Phil DeGreg, _Jazz Keyboard Harmony_ (1994), chs. 3–7: shells with extensions, three- and four-note rootless voicings, the root kept in m7b5 and dim7 voicings.
- Rawlins & Bahha, _Jazzology_ (2005), pp. 67–69: rootless voicings; "the 5th is often replaced by the 13th" on dominants.
- John Novello, _The Contemporary Keyboardist_ (1986): tension substitutions (the 9 for the root, the 13 for the 5th).
- Bill Dobbins, _The Contemporary Jazz Pianist_, vol. 2, p. 11: the 3rd and the 7th carry the quality; extensions don't sit far below chord tones; avoid unnecessary doubling.
- Tim Richards, _Exploring Jazz Piano_, vol. 1, p. 223: doubling the melody an octave below.
- Gary Lindsay, _Jazz Arranging Techniques_ (2005), ch. 12, pp. 93–94 (low interval limits) and ch. 16 (spread voicings: the lowest interval up to a 10th).
- Dmitri Tymoczko, _Tonality: An Owner's Manual_ (2023), prelude to ch. 2: a voicing is a pattern of spacing measured in steps along the chord; close and open position; inverting by moving every voice along the chord keeps the spacing.
- Gary Lindsay, _Jazz Arranging Techniques_ (2005), ch. 11: drop 2, drop 3 and drop 2 & 4 ("lowering the 2nd voice from the top, one octave").
- Block chords: Mark Levine, _The Jazz Piano Book_ (1989), ch. 19; Tim Richards, _Exploring Jazz Piano_, vol. 1, p. 223.

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
