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

## API

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

If no range and/or dictionary is given, there is a fallback to [default values](./index.ts) (look for defaultRange / defaultDictionary):

```ts
Voicing.search("C^7");
/* => [
  ['E3', 'G3', 'B3', 'D4'],
  ['E4', 'G4', 'B4', 'D5'],
  ['B3', 'D4', 'E4', 'G4'],
] */
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

## Optional: Voicing.analyze

```ts
export declare function analyze(voicing: string[]): {
  topNote: string;
  bottomNote: string;
  midiAverage: number;
};
```

Returns some useful info on the given voicing:

```ts
expect(Voicing.analyze(["C4", "E4", "G4", "B4"])).toEqual({
  topNote: "B4",
  bottomNote: "C4",
  midiAverage: 85.4, // did not check :)
  // many more values possible
});
```

## Optional: Voicing.analyzeTransition

```ts
export declare function analyzeTransition(
  from: string[],
  to: string[]
): {
  topNoteDiff: number;
  bottomNoteDiff: number;
  movement: number;
};
```

Returns some useful info on the given voice transition

```ts
expect(
  Voicing.analyzeTransition(["C4", "E4", "G4", "B4"], ["D4", "F4", "A4", "C5"])
).toEqual({
  topNoteDiff: 1,
  bottomNoteDiff: 2,
  movement: 5,
});
```

Could also use intervals instead of semitones (but semitones are easier to compare)

## Optional: Voicing.intervalSets

```ts
export declare function intervalSets(
  chordSymbol: string,
  dictionary: VoicingDictionary
);
```

Get possible interval sets for given chord in given dictionary:

```ts
expect(Voicing.intervalSets("M7", lefthand)).toEqual([
  ["3M 5P 7M 9M", "7M 9M 10M 12P"],
]);
// could also be used with chord symbol (ignore root)
expect(Voicing.intervalSets("CM7", lefthand)).toEqual([
  ["3M 5P 7M 9M", "7M 9M 10M 12P"],
]);
```

Note that it works, even if the chord symbol "M7" is just an alias of the "^7" symbol used in the dictionary.

## Optional: Voicing.searchSets

```ts
export declare function searchSets(
  intervalSets: string[][],
  range: string[],
  root: string
);
```

Renders all sets of notes that represent any of the interval sets inside the given range, relative to the root:

```ts
expect(
  Voicing.searchSets(
    [
      ["1P", "3M", "5P"],
      ["3M", "5P", "8P"],
    ],
    ["C3", "G4"],
    "C"
  )
).toEqual([
  ["C3", "E3", "G3"],
  ["E3", "G3", "C4"],
  ["C4", "E4", "G4"],
]);
```

changes:

- renamed to searchSets (similar to Voicing.search)
