# tonal


[![npm version](https://img.shields.io/npm/v/@tonaljs/modules.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/modules)
[![build status](https://img.shields.io/travis/tonaljs/tonal?style=flat-square)](http://travis-ci.org/tonaljs/tonal/)
![minified size](https://img.shields.io/badge/minified-23.6kb-blue?style=flat-square)
![gzipped size](https://img.shields.io/badge/gzipped-8.08kb-blue?style=flat-square)


`tonal` is a music theory library. Contains functions to manipulate tonal elements of music (note, intervals, chords, scales, modes, keys). It deals with abstractions (not actual music or sound).

`tonal` is implemented in Typescript and published as a collection of Javascript npm packages.

It uses a functional programing style: all functions are pure, there is no data mutation, and entities are represented by data structures instead of objects.

## Install

Install all modules:

```bash
npm install --save @tonaljs/modules
```

Or individually:

```bash
npm install --save @tonaljs/note @tonaljs/key
```


## Usage

Tonal is compatible with both ES5 and ES6 modules, and browser.

#### ES6 `import`:

```js
import { Tonal, Scale } from '@tonaljs/modules';
// or individually
import * as Tonal from "@tonaljs/tonal";
```

#### ES5 `require`:

```js
const { Tonal, Scale } = require('@tonaljs/modules');
```

#### Browser

Grab the [minified browser ready version](https://raw.githubusercontent.com/tonaljs/tonal/master/packages/modules/browser/tonal.min.js) from the repository and include in the html file:

```html
<script src="tonal.min.js"></script>
<script>
console.log(Tonal.Key.minorKey("Ab"));
</script>
```

#### Bundle size

`@tonaljs/modules` includes all published modules. Altough it is small (8kb gzipped), you can reduce bundle sizes by importing the modules individually, or even only the functions you need:

```js
import { transpose } from '@tonaljs/tonal'
import { scale } from '@tonaljs/scale'
```


## Example

```js
import { Tonal } from "@tonaljs/modules";
// or individually:
import * as Tonal from "@tonaljs/tonal";

Tonal.note("A4").midi; // => 60
Tonal.note("a4").freq; // => 440
Tonal.note("c#2").accidentals; // => '#'
Tonal.note("x").midi; // => undefined
Tonal.interval("5P").semitones; // => 7
Tonal.transpose("C4", "5P"); // => "G4"
Tonal.distance("C4", "G4"); // => "5P"
```





## Documentation

The API documentation lives inside README.md file of each module:


- [@tonaljs/tonal](/packages/tonal): Parse notes and intervals, calculate distances and transpositions
- [@tonaljs/midi](/packages/midi): Midi number conversions
- [@tonaljs/note](/packages/note): Note operations (simplify, transposeBy )
- [@tonaljs/interval](/packages/interval): Interval operations (add, simplify, invert)
- [@tonaljs/pcset](/packages/pcset): Pitch class sets properties
- [@tonaljs/mode](/packages/mode): Parse (greek) tonal modes (ionian, dorian, ...)
- [@tonaljs/scale-dictionary](/packages/scale-dictionary): A dictionary of scales
- [@tonaljs/chord-dictionary](/packages/chord-dictionary): A dictionary of chords
- [@tonaljs/scale](/packages/scale): Scales and its relations
- [@tonaljs/chord](/packages/chord): Chords and its relations
- [@tonaljs/key](/packages/key): Major and minor keys scales and chords
- [@tonaljs/progression](/packages/progression): Chord progressions
- [@tonaljs/roman-numeral](/packages/roman-numeral): Parse roman numeral symbols
- [@tonaljs/abc-notation](/packages/abc-notation): Parse ABC notation notes
- [@tonaljs/array](/packages/array): Array manipulation
- [@tonaljs/range](/packages/range): Create note ranges
- [@tonaljs/modules](/packages/modules): All modules bundled in one package

## Contributing

Read [contributing document](/docs/CONTRIBUTING.md) for instructions

## Inspiration

This library takes inspiration from other music theory libraries:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html
- Sharp11: https://github.com/jsrmath/sharp11

## License

[MIT License](docs/LICENSE)
