# tonal

`tonal` is a music theory library. Contains functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music or sound).

`tonal` is implemented in Typescript and published as a collection of npm modules. It uses a functional programing style: all functions are pure, there is no data mutation, and entities are represented by data structures instead of objects.

## New v3 in Typescript

IMPORTANT: master branch contains the new v3 version written in Typescript. **This version is not yet published **. For latest published version see [tonal v2](https://github.com/tonaljs/v2)

## Example

```js
import { note } from "@tonaljs/tonal";

note("A4").midi; // => 60
note("a4").freq; // => 440
note("c#2").accidentals; // => '#'
note("x").midi; // => undefined
```

## Documentation

The API documentation is inside each module:

- [@tonaljs/tonal](/packages/tonal): The core module. Note and interval properties, note transposition and interval distances. API: `note`, `interval`, `transpose`, `distance`

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
