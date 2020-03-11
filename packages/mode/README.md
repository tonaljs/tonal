# @tonaljs/mode ![tonal](https://img.shields.io/badge/@tonaljs-mode-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/mode.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/mode)

`@tonaljs/mode` greek modes dictionary

## Usage

ES6:

```js
import { Mode } from "@tonaljs/tonal";
```

node:

```js
const { Mode } = require("@tonaljs/tonal");
```

## API

#### `get(name: string) => object`

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
Mode.get("major");
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

#### `names() => string[]`

Get a list of all mode names.

```js
Mode.names();
// => ["ionian", "dorian", "phrygian", "lydian", "mixolydian", "aeolian", "locrian"];
```

#### `all() => object[]`

Return a list of known modes

```js
Mode.all();
```

## How to?

#### Get notes from a mode?

For example, "A major" mode:

```js
import { Mode, Note } from "@tonaljs/tonal";

Mode.get("major").intervals.map(Note.transposeFrom("A"));
["A", "B", "C#", "D", "E", "F#", "G#"];
```

## Want more?

Take a look to [@tonal/key](/packages/key)
