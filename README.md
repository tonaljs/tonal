# tonal

[![npm version](https://img.shields.io/npm/v/@tonaljs/tonal.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/tonal)
[![build status](https://img.shields.io/travis/tonaljs/tonal?style=flat-square)](http://travis-ci.org/tonaljs/tonal/)
![minified size](https://img.shields.io/badge/minified-23.6kb-blue?style=flat-square)
![gzipped size](https://img.shields.io/badge/gzipped-8.08kb-blue?style=flat-square)

`tonal` is a music theory library. Contains functions to manipulate tonal elements of music (note, intervals, chords, scales, modes, keys). It deals with abstractions (not actual music or sound).

`tonal` is implemented in Typescript and published as a collection of Javascript npm packages.

It uses a functional programing style: all functions are pure, there is no data mutation, and entities are represented by data structures instead of objects.

## Example

```js
import { Note, Interval } from "@tonaljs/tonal";

Note.note("A4").midi; // => 60
Note.note("a4").freq; // => 440
Note.note("c#2").accidentals; // => '#'
Note.note("x").midi; // => undefined
Note.transpose("C4", "5P"); // => "G4"
Interval.interval("5P").semitones; // => 7
Interval.distance("C4", "G4"); // => "5P"
```

## Install

```bash
npm install --save @tonaljs/tonal
```

## Usage

Tonal is compatible with both ES5 and ES6 modules, and browser.

#### ES6 `import`:

```js
import { Note, Scale } from "@tonaljs/tonal";
```

#### ES5 `require`:

```js
const { Note, Scale } = require("@tonaljs/tonal");
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

`@tonaljs/tonal` includes all published modules. Although tonal it is small, you can reduce bundle sizes by importing the modules individually, or even only the functions you need:

```
npm i @tonaljs/core
```

```js
import { transpose } from "@tonaljs/core";
transpose("A4", "P5");
```

## Documentation

The API documentation lives inside README.md file of each module:

- [@tonaljs/tonal](/packages/tonal): All modules bundled in one package
- [@tonaljs/note](/packages/note): Note operations (simplify, transposeBy )
- [@tonaljs/midi](/packages/midi): Midi number conversions
- [@tonaljs/scale](/packages/scale): Scales and its relations
- [@tonaljs/chord](/packages/chord): Chords and its relations
- [@tonaljs/interval](/packages/interval): Interval operations (add, simplify, invert)
- [@tonaljs/pcset](/packages/pcset): Pitch class sets properties
- [@tonaljs/mode](/packages/mode): Parse (greek) tonal modes (ionian, dorian, ...)
- [@tonaljs/scale-dictionary](/packages/scale-dictionary): A dictionary of scales
- [@tonaljs/chord-dictionary](/packages/chord-dictionary): A dictionary of chords
- [@tonaljs/key](/packages/key): Major and minor keys scales and chords
- [@tonaljs/progression](/packages/progression): Chord progressions
- [@tonaljs/roman-numeral](/packages/roman-numeral): Parse roman numeral symbols
- [@tonaljs/abc-notation](/packages/abc-notation): Parse ABC notation notes
- [@tonaljs/core](/packages/core): Core functions (note, interval, transpose and distance)
- [@tonaljs/array](/packages/array): Array manipulation
- [@tonaljs/range](/packages/range): Create note ranges

## Contributing

Read [contributing document](/docs/CONTRIBUTING.md) for instructions

## Inspiration

This library takes inspiration from other music theory libraries:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html
- Sharp11: https://github.com/jsrmath/sharp11

## Projects using tonal

Showcase of projects that are using Tonal:

- [Solfej](https://www.solfej.io/) by [Shayan Javadi](https://github.com/ShayanJavadi)
- [EarBeater](https://www.earbeater.com/online-ear-training/) by [Morten Vestergaard](https://github.com/vellebelle)
- [sonid.app](https://sonid.app/) ([play store](https://play.google.com/store/apps/details?id=org.stroopwafel.music.app), [apple store](https://apps.apple.com/us/app/sonid/id1490221762?ls=1)) by [martijnmichel](https://github.com/martijnmichel)

Thank you all!

Add your project here by [editing this file](https://github.com/tonaljs/tonal/edit/master/README.md)

## License

[MIT License](docs/LICENSE)
