---
title: Chord Voicings
---

`@tonaljs/voicing`

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

## API

> **Migration (tonal 6.7):** `get` now returns `[]` when no voicing is found; check `voicing.length === 0` instead of `!voicing` or `??`. `search` without a dictionary now searches `VoicingDictionary.all` (it was `VoicingDictionary.triads`), so it returns more results.

### Voicing.search

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

The VoicingDictionary param uses the format of [@tonaljs/voicing-dictionary](./dictionary). Instead of defining your own, you could also use an existing dictionary from there:

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

### Voicing.get

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

### Voicing.sequence

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
