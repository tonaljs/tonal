# tonal

`tonal` is a music theory library. Contains functions to manipulate tonal elements of music (note, intervals, chords, scales, modes, keys). It deals with abstractions (not actual music or sound).

`tonal` is implemented in Typescript and published as a collection of npm modules. It uses a functional programing style: all functions are pure, there is no data mutation, and entities are represented by data structures instead of objects.

## ⚠️ New v3 in Typescript 🎉

New version of `tonal` is written in Typescript.

Unfortunately, there's a lot of breaking changes. See [migrate from v2](docs/migrate-from-v2.md) to learn about that changes.

The most important breaking changes includes:

- `@tonaljs/tonal` now exports the tonal core: `note`, `interval`, `transpose` and `distance` functions. In version 2 `tonal` module was a facade. In v3 this is not true anymore.
- API radically simplified. Utility methods made private.
- Related: all functions to extract a single property from anything are removed. For example: in v2 `Note.name('C4')` should be written in v3 as: `note('C4').name`

Hopefully, those breaking changes made the library easy to understand and maintain.

This version is not yet published. For latest published version see [tonal v2](https://github.com/tonaljs/v2)

#### Migrating from v2

## Example

```js
import { note, interval, transpose, distance } from "@tonaljs/tonal";

note("A4").midi; // => 60
note("a4").freq; // => 440
note("c#2").accidentals; // => '#'
note("x").midi; // => undefined
interval("5P").semitones; // => 7
transpose("C4", "5P"); // => "G4"
distance("C4", "G4"); // => "5P"
```

## Documentation

The API documentation is inside each module:

- [@tonaljs/tonal](/packages/tonal): Note and interval properties, note transposition and distance
- [@tonaljs/midi](/packages/midi): Midi number conversions
- [@tonaljs/pcset](/packages/pcset): Pitch class sets
- [@tonaljs/mode](/packages/mode): Tonal models
- [@tonaljs/scale-dictionary](/packages/scale-dictionary): A dictionary of scales
- [@tonaljs/chord-dictionary](/packages/chord-dictionary): A dictionary of chords
- [@tonaljs/scale](/packages/scale): Scales and its relations
- [@tonaljs/chord](/packages/chord): Chords and its relations

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
