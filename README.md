# tonal

[![npm version](https://img.shields.io/npm/v/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)
[![build status](https://img.shields.io/github/workflow/status/tonaljs/tonal/tests?style=flat-square)](https://github.com/tonaljs/tonal/actions)
![minified size](https://img.shields.io/badge/minified-31.1kb-blue?style=flat-square)
![gzipped size](https://img.shields.io/badge/gzipped-11.01kb-blue?style=flat-square)

`tonal` is a music theory library. Contains functions to manipulate tonal
elements of music (note, intervals, chords, scales, modes, keys). It deals with
abstractions (not actual music or sound).

`tonal` is implemented in Typescript and published as a collection of Javascript
npm packages.

It uses a functional programing style: all functions are pure, there is no data
mutation, and entities are represented by data structures instead of objects.

## Example

```js
import { Interval, Note, Scale } from "tonal";

Note.midi("A4"); // => 60
Note.freq("a4").freq; // => 440
Note.accidentals("c#2"); // => '#'
Note.transpose("C4", "5P"); // => "G4"
Interval.semitones("5P"); // => 7
Interval.distance("C4", "G4"); // => "5P"
Scale.get("C major").notes; // =>["C", "D", "E", "F", "G", "A", "B"];
```

## Install

Install all packages at once:

```bash
npm install --save tonal
```

## Usage

Tonal is compatible with both ES5 and ES6 modules, and browser.

#### ES6 `import`:

```js
import { Note, Scale } from "tonal";
```

#### ES5 `require`:

```js
const { Note, Scale } = require("tonal");
```

#### Browser

You can use the browser version from jsdelivr CDN directly in your html:

```html
<script src="https://cdn.jsdelivr.net/npm/tonal/browser/tonal.min.js"></script>
<script>
  console.log(Tonal.Key.minorKey("Ab"));
</script>
```

Or if you prefer, grab the
[minified browser ready version](https://raw.githubusercontent.com/tonaljs/tonal/master/packages/tonal/browser/tonal.min.js)
from the repository.

#### Bundle size

`tonal` includes all published modules.

Although the final bundle it is small, you can
reduce bundle sizes even more by installing the modules individually, and
importing only the functions you need.

Note that individual modules are prefixed with `@tonaljs/`. For example:

```bash
npm i @tonaljs/note
```

```js
import { transpose } from "@tonaljs/note";
transpose("A4", "P5");
```

## Documentation

Generally, you just need to install `tonal` package (before it was called `@tonaljs/tonal`).

The API documentation is inside README.md of each module 👇

#### Notes and intervals

- [@tonaljs/note](/packages/note): Note operations (simplify, transposeBy )
- [@tonaljs/midi](/packages/midi): Midi number conversions
- [@tonaljs/interval](/packages/interval): Interval operations (add, simplify,
  invert)
- [@tonaljs/pitch-notation-abc](/packages/pitch-notation-abc): Parse ABC
  notation notes

#### Scales and chords

- [@tonaljs/scale](/packages/scale): Scales
- [@tonaljs/scale-type](/packages/scale-type): A dictionary of scales
- [@tonaljs/chord](/packages/chord): Chords
- [@tonaljs/chord-type](/packages/chord-type): A dictionary of chords
- [@tonaljs/chord-detect](/packages/chord-detect): Detect chords from notes
- [@tonaljs/pcset](/packages/pcset): Pitch class sets. Compare note groups.

#### Keys, chord progressions

- [@tonaljs/key](/packages/key): Major and minor keys, it's scales and chords
- [@tonaljs/mode](/packages/mode): A dictionary of Greek modes (ionian,
  dorian...)
- [@tonaljs/progression](/packages/progression): Chord progressions
- [@tonaljs/roman-numeral](/packages/roman-numeral): Parse roman numeral symbols

#### Time, rhythm

- [@tonaljs/time-signature](/packages/time-signature): Parse time signatures
- [@tonaljs/duration-value](/packages/duration-value): Note duration values

#### Utilities

- [@tonaljs/core](/packages/core): Core functions (note, interval, transpose and
  distance)
- [@tonaljs/collection](/packages/collection): Utility functions to work with
  collections (range, shuffle, permutations)
- [@tonaljs/range](/packages/range): Create note ranges

## Contributing

Read [contributing document](/docs/CONTRIBUTING.md). To contribute open a PR and ensure:

- If is a music theory change (like the name of a scale) link to reliable references.
- If is a new feature, add documentation: changes to README of the affected module(s) are expected.
- Ad tests: changes to the test.ts file of the affected module(s) are expected.
- All tests are green

## Inspiration

This library takes inspiration from other music theory libraries:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html
- Sharp11: https://github.com/jsrmath/sharp11
- python-mingus: https://github.com/bspaans/python-mingus

## Projects using tonal

Showcase of projects that are using Tonal:

- [Solfej](https://www.solfej.io/) by
  [Shayan Javadi](https://github.com/ShayanJavadi)
- [EarBeater](https://www.earbeater.com/online-ear-training/) by
  [Morten Vestergaard](https://github.com/vellebelle)
- [Sonid](https://sonid.app/)
  ([play store](https://play.google.com/store/apps/details?id=org.stroopwafel.music.app),
  [apple store](https://apps.apple.com/us/app/sonid/id1490221762?ls=1)) by
  [martijnmichel](https://github.com/martijnmichel)
- [Songcraft](https://songcraft.io/) by
  [Gabe G'Sell](https://github.com/gabergg)
- [React Guitar](https://react-guitar.com/) by
  [4lejandrito](https://github.com/4lejandrito)
- [Fretty.app](https://fretty.app/) by [tfeldmann](https://github.com/tfeldmann)
- [Chordify](https://ashleymays.github.io/Chordify) by [ashleymays](https://github.com/ashleymays)
- [Chordal](https://chordal.vercel.app) by [kad1kad](https://github.com/kad1kad)
- [muted.io](https://muted.io/) by [thisisseb](https://github.com/thisisseb)

Thank you all!

Add your project here by
[editing this file](https://github.com/tonaljs/tonal/edit/main/README.md)

## License

[MIT License](docs/LICENSE)
