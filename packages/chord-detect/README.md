# @tonaljs/chord-detect ![tonal](https://img.shields.io/badge/@tonaljs-chord_detect-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord-detect.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord-detect)

## Usage

With ES6 `import`:

```js
import { Chord } from "tonal";
```

With ES5 `require`:

```js
const { Chord } = require("tonal");
```

Standalone:

```js
import { detect } from "@tonaljs/chord-detect";
```

## API

### `Chord.detect(notes: string[], options?: { assumePerfectFifth?: boolean }) => string[]`

Examples:

```js
Chord.detect(["D", "F#", "A", "C"]); // => ["D7"]
Chord.detect(["F#", "A", "C", "D"]); // => ["D7/F#"]
Chord.detect(["A", "C", "D", "F#"]); // => ["D7/A"]
Chord.detect(["E", "G#", "B", "C#"]); // => ["E6", "C#m7/E"]
```

This function is also exposed in [`Chord`](/packages/chord) module.

#### Options

- `assumePerfectFifth`: assumes perfect fifth if no fifth is present

```js
detect(["D", "F", "C"], { assumePerfectFifth: true }); // => ["Dm7"]
detect(["D", "F", "C"], { assumePerfectFifth: false }); // => []
```
