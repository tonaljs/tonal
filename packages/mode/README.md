# @tonaljs/mode ![tonal](https://img.shields.io/badge/@tonaljs-mode-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/mode.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/mode)

`@tonaljs/mode` greek modes dictionary

## API

### `mode(name: string) => Mode`

Given a mode name, returns a Mode object with the following fields:

- name: the mode name
- aliases: alternative mode names
- modeNum: the mode number (0...7)
- mode: the mode number
- alt: the alterations
- triad: the triad chord type
- seventh: the seventh chord type

Example:

```js
mode("major");
// {
//   name: "ionian",
//   aliases: ["major"]
//   intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
//   modeNum: 0,
//   mode: 2773,
//   alt: 0,
//   triad: "",
//   seventh: "Maj7",
// }
```

### `entries() => Mode[]`

Return a list of known modes

Example:

```js
entries().map(mode => mode.name);
// => ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];
```

## How to?

#### Get notes from a mode?

For example, "A major" mode:

```js
import { transpose } from "@tonaljs/tonal";
import { mode } from "@tonaljs/mode";

mode("major").intervals.map(interval => transpose("A", interval));
["A", "B", "C#", "D", "E", "F#", "G#"];
```

## Want more?

Take a look to [@tonal/key]()
