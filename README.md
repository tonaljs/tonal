# tonal

[![npm version](https://img.shields.io/npm/v/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)

`tonal` is a music theory library for building composition tools: notes,
intervals, chords, scales, keys, voicings, progressions, chord charts, note
patterns and rhythm patterns.

- **Pure functions, data in and out:** no mutation, no classes. Invalid input
  gives an empty value (`""`, `[]`, `null` or `{ empty: true }`) instead of an
  exception.
- **Written in TypeScript**, with no runtime dependencies, and published as
  `tonal` and as a collection of smaller `@tonaljs/*` packages.
- **It describes music, it doesn't play it:** notes, chords and where things are
  in musical time (when they play, with tempo and seconds, comes step by step),
  never sound or scheduling. Use an audio library for that.

## Example

```js
import {
  Chart,
  Chord,
  Interval,
  Note,
  Pattern,
  RhythmPattern,
  Scale,
  Time,
  Voicing,
} from "tonal";

Note.midi("C4"); // => 60
Note.freq("a4"); // => 440
Note.accidentals("c#2"); // => '#'
Note.transpose("C4", "5P"); // => "G4"
Interval.semitones("5P"); // => 7
Interval.distance("C4", "G4"); // => "5P"

// Scales
Scale.get("C major").notes; // => ["C", "D", "E", "F", "G", "A", "B"];
[1, 3, 5, 7].map(Scale.degrees("C major")); // => ["C", "E", "G", "B"]

Chord.get("Cmaj7").name; // => "C major seventh"
Chord.detect(["D", "F", "A", "C"]); // => ["Dm7", "F6/D"]
Scale.chords("D dorian", { size: 4 }).map((c) => c.symbol);
// => ["Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5", "Cmaj7"]

// Chord inversions
const triad = Chord.degrees("Cm");
[1, 2, 3].map(triad); // => ["C", "Eb", "G"];
[2, 3, 1].map(triad); // => ["Eb", "G", "C"];
[3, 1, 2].map(triad); // => ["G", "C", "Eb"];

// Voicings with smooth voice leading
Voicing.sequence(["Dm7", "G7", "Cmaj7"]);
// => [["D3", "F3", "A3", "C4"], ["D3", "F3", "G3", "B3"], ["C3", "E3", "G3", "B3"]]

// Note patterns: arpeggios and melodic sequences as indexes
Pattern.arpeggio("up-down", 4).map(Chord.steps(["C4", "maj7"]));
// => ["C4", "E4", "G4", "B4", "G4", "E4"]

// Rhythm patterns
RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.toDurations([1, 0, 0, 1, 0, 0, 1, 0]); // => [3, 3, 2]

// Chord charts: sections, repeats and endings, the chord at a position
const chart = Chart.parse(
  "[A] | Dm7 G7 | Cmaj7 | % |\n[B] |: Fmaj7 |1 E7 :|2 E7 Am7 |",
);
const chords = Chart.chords(chart);
chords.map((c) => c.value);
// => ["Dm7", "G7", "Cmaj7", "Cmaj7", "Fmaj7", "E7", "Fmaj7", "E7", "Am7"]
Chart.chordAt(chords, Time.fromBarBeat("1:3", "4/4"))?.value; // => "G7"

// Time: exact positions and durations, in quarter notes
Time.add(Time.duration("q."), [1, 3]); // => [11, 6]
```

## Install

Install all packages at once:

```bash
npm install --save tonal
```

You can read [CHANGELOG here](https://github.com/tonaljs/tonal/blob/main/docs/CHANGELOG.md).

## Usage

Tonal works with ES modules (`import`), CommonJS (`require`) and in the browser.

#### ES modules (`import`)

```js
import { Note, Scale } from "tonal";
```

#### CommonJS (`require`)

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
[minified browser ready version](https://raw.githubusercontent.com/tonaljs/tonal/main/packages/tonal/browser/tonal.min.js)
from the repository.

#### Bundle size

`tonal` includes all published modules.

The browser build is about 27 KB gzipped. You can reduce bundle sizes even
more by installing the modules individually, and importing only the functions
you need.

Note that individual modules are prefixed with `@tonaljs/`. For example:

```bash
npm i @tonaljs/note
```

```js
import { transpose } from "@tonaljs/note";
transpose("A4", "P5");
```

## Documentation

Visit the [documentation site](https://tonaljs.github.io/tonal/docs) or the README.md of each module 👇

To see what tonal can do, try the [apps](https://tonaljs.github.io/tonal/apps/): a chord finder, scale chords, a key explorer, voicings and more, each showing the tonal calls behind it.

Using a coding agent? Point it to [llms.txt](https://tonaljs.github.io/tonal/llms.txt): it links to a [guide for agents](https://tonaljs.github.io/tonal/docs/agents/) and to [every function with its signature](https://tonaljs.github.io/tonal/llms-api.txt), which is also in the npm package as `node_modules/tonal/llms-api.txt`.

#### Notes and intervals

- [@tonaljs/note](/packages/note): Note operations (simplify, transposeBy )
- [@tonaljs/midi](/packages/midi): Midi number conversions
- [@tonaljs/interval](/packages/interval): Interval operations (add, simplify,
  invert)
- [@tonaljs/abc-notation](/packages/abc-notation): Parse ABC
  notation notes

#### Scales and chords

- [@tonaljs/scale](/packages/scale): Scales
- [@tonaljs/scale-type](/packages/scale-type): A dictionary of scales
- [@tonaljs/chord](/packages/chord): Chords
- [@tonaljs/chord-type](/packages/chord-type): A dictionary of chords
- [@tonaljs/chord-detect](/packages/chord-detect): Detect chords from notes
- [@tonaljs/pcset](/packages/pcset): Pitch class sets. Compare note groups.

#### Voicings

- [@tonaljs/voicing](/packages/voicing/): Voicings of any chord by rules and templates, for one chord or a whole progression
- [@tonaljs/voice-leading](/packages/voice-leading/): Voice-leading distance and the smoothest path between voicings
- [@tonaljs/voicing-dictionary](/packages/voicing-dictionary/): Collections of chord voicings (deprecated: use `Voicing`)

#### Keys, chord progressions, charts

- [@tonaljs/chart](/packages/chart): Chord charts: bars, sections and meters, the played form, and the chord at a position
- [@tonaljs/key](/packages/key): Major and minor keys, their scales and chords
- [@tonaljs/mode](/packages/mode): A dictionary of Greek modes (ionian,
  dorian...)
- [@tonaljs/progression](/packages/progression): Chord progressions
- [@tonaljs/roman-numeral](/packages/roman-numeral): Parse roman numeral symbols

#### Time, rhythm, patterns

- [@tonaljs/time](/packages/time): Musical time as exact fractions of quarter notes: positions, durations, meters and bar:beat
- [@tonaljs/pattern](/packages/pattern): Note patterns: arpeggio orders and melodic sequences as lists of indexes
- [@tonaljs/rhythm-pattern](/packages/rhythm-pattern): Generate, read and measure rhythm patterns (Euclidean rhythms, evenness, oddity...)
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

- If it's a music theory change (like the name of a scale), link to reliable references.
- If it's a new feature, add documentation: changes to the README of the affected module(s) are expected.
- Add tests: changes to the test.ts file of the affected module(s) are expected.
- If it changes a published package, add a changeset (`npx changeset`).
- If it changes a public function or its JSDoc, regenerate the API list for agents (`npm run docs:api`).
- All tests are green (`npm run test:all`)

## Inspiration

This library takes inspiration from other music theory libraries:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: https://www.music21.org/music21docs/
- Sharp11: https://github.com/jsrmath/sharp11
- python-mingus: https://github.com/bspaans/python-mingus
- Open Music Theory: https://viva.pressbooks.pub/openmusictheory/

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
- [Midi Sandbox](https://midisandbox.com/) by [jdlee022](https://github.com/jdlee022)
- [music, eternal](https://eternal.rob.computer) by [kousun12](https://github.com/kousun12)
- [Chromatone.center](https://chromatone.center) by [davay42](https://github.com/davay42)
- [Super Oscillator](https://github.com/lukehorvat/super-oscillator) by [lukehorvat](https://github.com/lukehorvat)
- [StringScales](https://stringscales.com/) by [Ambewas](https://github.com/ambewas)
- [Polychron](https://github.com/PolychronMidi/Polychron) by [i1li](https://github.com/i1li)
- [MusicTrainer](https://musictrainer.barnman.cc) by [zilongliu](https://github.com/Zilong-L)
- [RiffScore](https://riffscore.netlify.app/) by [joekotvas](https://github.com/joekotvas/)
- [tonal_rs](https://github.com/TvrtkoM/tonal_rs) rust port by [TvrtkoM](https://github.com/TvrtkoM/)

Thank you all!

Add your project here by
[editing this file](https://github.com/tonaljs/tonal/edit/main/README.md)

## License

[MIT License](docs/LICENSE)
