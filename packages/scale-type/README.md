# @tonaljs/scale-type ![tonal](https://img.shields.io/badge/@tonaljs-scale_type-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/scale-type.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/scale-type)

`@tonaljs/scale-type` is a dictionary of musical scales.

## Usage

ES6:

```js
import { ScaleType } from "tonal";
```

nodejs:

```js
const { ScaleType } = require("tonal");
```

## API

### `ScaleType.get`

`get(name: string) => ScaleType`

Given a scale type name, return a ScaleType object with the following properties:

- empty: true if the scale type is not found
- name: the scale type name
- aliases: a list of alternative names
- setNum: the pcset number
- chroma: the pcset chroma
- normalized: the pcset chroma rotated to start with its first note
- intervals: the interval list
- family: the parent scale it's a mode of, or `""` (see [Families](#families))
- degree: the degree of the parent scale the mode starts on, from 1, or `0`

Example:

```js
ScaleType.get("major"); // =>
// {
//   empty: false,
//   name: "major",
//   setNum: 2773,
//   chroma: "101011010101",
//   normalized: "101010110101",
//   intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
//   aliases: ["ionian"],
//   family: "major",
//   degree: 1,
// }
```

### `ScaleType.names`

`names() => string[]`

Return a list of all scale names

### `ScaleType.all`

`all() => object[]`

Return a list of all scale types

### `ScaleType.add`

`add(intervals: string[], name: string, aliases?: string[]) => ScaleType`

Add a scale type to dictionary:

```js
ScaleType.add(["1P", "5P"], "fifth", ["5"]);
```

### `ScaleType.addAlias`

`addAlias(scaleType: ScaleType, alias: string) => void`

Add an alias to get a scale type from the dictionary. The alias is only used to find it (it's not added to its `aliases`):

```js
ScaleType.addAlias(ScaleType.get("major"), "dur");
ScaleType.get("dur").name; // => "major"
```

### `ScaleType.keys`

`keys() => string[]`

List every key that finds a scale type: names, aliases, set numbers and chromas:

```js
ScaleType.keys().includes("ionian"); // => true
```

### `ScaleType.removeAll`

`removeAll() => void`

Remove every scale type from the dictionary. Other modules that use it (`Scale`, `Chord.chordScales`...) won't find any scale afterwards.

## Families

A family is a parent scale and its modes: the scales that start on each of its notes. Every scale type that is a mode of a parent has the parent's name as `family` and the parent's degree it starts on as `degree`. The families are major, melodic minor, harmonic minor, harmonic major, neapolitan major, neapolitan minor, double harmonic major and major pentatonic, and every mode of them has a name:

```js
ScaleType.get("dorian b5").family; // => "harmonic major"
ScaleType.get("dorian b5").degree; // => 2
ScaleType.all()
  .filter((type) => type.family === "harmonic major")
  .sort((a, b) => a.degree - b.degree)
  .map((type) => type.name);
// => ["harmonic major", "dorian b5", "phrygian b4", "lydian diminished",
//     "mixolydian b2", "lydian augmented #2", "locrian bb7"]
```

The family comes from the notes, so a scale type added with `ScaleType.add` gets one too. The family is the name of its first mode: `ScaleType.get(type.family)` is the parent scale. To get the modes of a scale with notes, use `Scale.modeNames`.

## Names

Scale names vary between sources. tonal uses the most common name and keeps others as aliases, but leaves out names that sources give to different scales:

- **hirajoshi**: tonal's "hirajoshi" is `1 2 b3 5 b6` (as in Kostka and Payne). Other sources give the name to other modes of the same pentatonic: `1 3 #4 5 7` (tonal's "lydian pentatonic") or `1 b2 4 b5 b7` (tonal's "iwato"), and some call `1 2 b3 5 b6` "iwato". See [Hirajōshi scale](https://en.wikipedia.org/wiki/Hiraj%C5%8Dshi_scale).
- **hungarian gypsy**, **gypsy** and **romani minor** name `1 2 b3 #4 5 b6 b7` in some sources, `1 2 b3 #4 5 b6 7` (hungarian minor) in others, and "gypsy" is tonal's alias for double harmonic major. The first one is "aeolian #4" in tonal.
- **leading whole tone** is spelled with a minor seventh (`1 2 3 #4 #5 b7 7`); as the second mode of neapolitan major it's also "lydian augmented #6".

## How to...

### How to get all pentatonics names?

```js
ScaleType.all()
  .filter((scaleType) => scaleType.intervals.length === 5)
  .map((scaleType) => scaleType.name);
```

### How to add a scale to the dictionary?

```js
ScaleType.add(["1P", "5P"], "quinta", ["quinta justa", "diapente"]);
ScaleType.get("quinta"); // => { name: "quinta", intervals: ...}
ScaleType.get("quinta justa"); // => { name: "quinta", intervals: ... }
```

## References

Some sources explaining various scale systems:

- [Modes](<https://en.wikipedia.org/wiki/Mode_(music)>)
- [Blues Scales](https://en.wikipedia.org/wiki/Blues_scale)
- [Jazz Scales](https://en.wikipedia.org/wiki/Jazz_scale)
- [Messiaen's "Modes of Limited Transposition" (wikipedia, en)](https://en.wikipedia.org/wiki/Mode_of_limited_transposition)
- [Raga](https://de.wikipedia.org/wiki/Raga)
- [Harmonic major scale](https://en.wikipedia.org/wiki/Harmonic_major_scale)
- [Neapolitan scale](https://en.wikipedia.org/wiki/Neapolitan_scale) (major and minor)
- [Double harmonic scale](https://en.wikipedia.org/wiki/Double_harmonic_scale)
- [Ian Ring's scale catalogue](https://ianring.com/musictheory/scales/)
