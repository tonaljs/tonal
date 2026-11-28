# Keys

> Key scales and chords

> **Try it:** [Key explorer](https://tonaljs.github.io/tonal/apps/key-explorer/). Click a key on the circle of fifths to get its signature, scale and chords: diatonic chords with their functions, secondary and substitute dominants with their ii, chord scales, and the related keys. Major and the three minor scales.
> **Try it:** [Reharmonizer](https://tonaljs.github.io/tonal/apps/reharmonizer/). Paste a chart and reharmonize it: the original on top with what each chord does in the key, and below a dropdown of substitutes on each chord, or one click for tritone subs, ii–Vs, secondary dominants or passing diminished chords. Hear one after the other, with a melody that follows the chords.

Get scale and chords of major and minor keys.

Obtain information of a key's scales and chords:

```js
Key.majorKey("C").triads; // => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]
Key.majorKeyChords("C").find((chord) => chord.name === "Am7"); // => { name: "Am7", roles: ["T", "ii/V"] }
```

## API

Tonics of any key are represented with pitch classes (octaves are discarded).

```js
Key.majorKey("C4"); // is equal to
Key.majorKey("C");
```

### `Key.majorKey`

`majorKey(tonic: string) => MajorKey`

Major key properties for a given tonic. Example:

```js
Key.majorKey("C"); // =>
{
  tonic: "C",
  type: "major",
  minorRelative: "A",
  alteration: 0,
  keySignature: "",
  grades: ["I", "II", "III", "IV", "V", "VI", "VII"],
  intervals: ["1P", "2M", "3M", "4P", "5P", "6M", "7M"],
  scale: ["C", "D", "E", "F", "G", "A", "B"],
  triads: ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  chords: ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"],
  chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "T", "D"],
  chordScales: ["C major", "D dorian", "E phrygian", "F lydian", "G mixolydian", "A minor", "B locrian"],
  secondaryDominants: ["", "A7", "B7", "C7", "D7", "E7", ""],
  secondaryDominantSupertonics: ["", "Em7b5", "F#m7b5", "Gm7", "Am7", "Bm7b5", ""],
  substituteDominants: ["", "Eb7", "F7", "Gb7", "Ab7", "Bb7", ""],
  substituteDominantSupertonics: ["", "Bbm7", "Cm7", "Dbm7", "Ebm7", "Fm7", ""],
}
```

A substitute dominant is spelled a diminished fifth above its secondary dominant (`Gb7` for `C7`), unless that needs a double flat or sharp: then it takes the simplest name, as a lead sheet writes it. So in Eb major the substitute of `Eb7` is `A7`, not `Bbb7`.

The supertonics are the ii chords of the ii-V into each degree:

- A secondary dominant's ii takes its quality from the target. Into a minor or diminished chord it's half-diminished (`Em7b5 A7 Dm`), and into a major or augmented chord it's a minor seventh (`Gm7 C7 F`).
- A substitute dominant's ii is always a minor seventh (`Bbm7 Eb7 Dm`). The substitute dominant resolves down a half step instead of to its own tonic (`Eb7` goes to `Dm`, not to `Ab`), so the target's quality doesn't change its ii.

The key also has `secondaryDominantsMinorRelative` and `substituteDominantsMinorRelative`, deprecated aliases of `secondaryDominantSupertonics` and `substituteDominantSupertonics`.

### `Key.minorKey`

`minorKey(tonic: string) => MinorKey`

Minor key properties for a given tonic. Example:

```js
Key.minorKey("C"); // =>
{
  tonic: "C",
  type: "minor",
  relativeMajor: "Eb",
  alteration: -3,
  keySignature: "bbb",
  natural: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "bVI", "bVII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7m"],
    scale: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
    triads: ["Cm", "Ddim", "Eb", "Fm", "Gm", "Ab", "Bb"],
    chords: ["Cm7", "Dm7b5", "Ebmaj7", "Fm7", "Gm7", "Abmaj7", "Bb7"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "SD", "SD"],
    chordScales: ["C minor", "D locrian", "Eb major", "F dorian", "G phrygian", "Ab lydian", "Bb mixolydian"],
    secondaryDominants: ["G7", "", "", "C7", "D7", "Eb7", "F7"],
    secondaryDominantSupertonics: ["Dm7b5", "", "", "Gm7b5", "Am7b5", "Bbm7", "Cm7"],
    substituteDominants: ["Db7", "", "", "Gb7", "Ab7", "A7", "B7"],
    substituteDominantSupertonics: ["Abm7", "", "", "Dbm7", "Ebm7", "Em7", "F#m7"],
  },
  harmonic: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "bVI", "VII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6m", "7M"],
    scale: ["C", "D", "Eb", "F", "G", "Ab", "B"],
    triads: ["Cm", "Ddim", "Ebaug", "Fm", "G", "Ab", "Bdim"],
    chords: ["CmMaj7", "Dm7b5", "Eb+maj7", "Fm7", "G7", "Abmaj7", "Bo7"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "SD", "D"],
    chordScales: ["C harmonic minor", "D locrian 6", "Eb major augmented", "F dorian #4", "G phrygian dominant", "Ab lydian #9", "B ultralocrian"],
    secondaryDominants: ["", "", "", "C7", "D7", "Eb7", ""],
    secondaryDominantSupertonics: ["", "", "", "Gm7b5", "Am7", "Bbm7", ""],
    substituteDominants: ["", "", "", "Gb7", "Ab7", "A7", ""],
    substituteDominantSupertonics: ["", "", "", "Dbm7", "Ebm7", "Em7", ""],
  },
  melodic: {
    tonic: "C",
    grades: ["I", "II", "bIII", "IV", "V", "VI", "VII"],
    intervals: ["1P", "2M", "3m", "4P", "5P", "6M", "7M"],
    scale: ["C", "D", "Eb", "F", "G", "A", "B"],
    triads: ["Cm", "Dm", "Ebaug", "F", "G", "Adim", "Bdim"],
    chords: ["Cm6", "Dm7", "Eb+maj7", "F7", "G7", "Am7b5", "Bm7b5"],
    chordsHarmonicFunction: ["T", "SD", "T", "SD", "D", "", ""],
    chordScales: ["C melodic minor", "D dorian b2", "Eb lydian augmented", "F lydian dominant", "G mixolydian b6", "A locrian #2", "B altered"],
    secondaryDominants: ["", "A7", "", "C7", "D7", "", ""],
    secondaryDominantSupertonics: ["", "Em7b5", "", "Gm7", "Am7", "", ""],
    substituteDominants: ["", "Eb7", "", "Gb7", "Ab7", "", ""],
    substituteDominantSupertonics: ["", "Bbm7", "", "Dbm7", "Ebm7", "", ""],
  },
}
```

Each of `natural`, `harmonic` and `melodic` also has the deprecated `secondaryDominantsMinorRelative` and `substituteDominantsMinorRelative`.

The chords are the ones used in each key, so they follow jazz practice. They're the scale's thirds stacked on each degree, except the tonic chord of melodic minor, which is `m6` (`Cm6`, C Eb G A) rather than the stacked `mMaj7` (`CmMaj7`, C Eb G B). For the stacked chords of any scale, see [`Scale.chords`](https://tonaljs.github.io/tonal/docs/groups/scales.md).

### `Key.majorTonicFromKeySignature`

`majorTonicFromKeySignature(keySignature: string | number) => string | null`

Get the tonic of the major key with a given key signature, written as accidentals or as a number of alterations. Example:

```js
Key.majorTonicFromKeySignature("bbb"); // => "Eb"
Key.majorTonicFromKeySignature(-3); // => "Eb"
```

### `Key.majorKeyChords`

`majorKeyChords(tonic: string) => KeyChord[]`

Return a list of all available chords for a given major key. Each chord is an object `{ name: string, roles: string[] }`:

```js
Key.majorKeyChords("C")
  .map((chord) => chord.name)
  .join(", ");
// => "Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bm7b5, A7, B7, C7, D7, E7, Em7b5, F#m7b5, Gm7, Eb7, F7, Gb7, Ab7, Bb7, Bbm7, Cm7, Dbm7, Ebm7, Fm7"
```

### `Key.minorKeyChords`

`minorKeyChords(tonic: string) => KeyChord[]`

Return a list of all available chords for a given minor key:

```js
Key.minorKeyChords("C")
  .map((chord) => chord.name)
  .join(", ");
// => "Cm7, Dm7b5, Ebmaj7, Fm7, Gm7, Abmaj7, Bb7, G7, C7, D7, Eb7, F7, Gm7b5, Am7b5, Bbm7, Db7, Gb7, Ab7, A7, B7, Abm7, Dbm7, Ebm7, Em7, F#m7, CmMaj7, Eb+maj7, Bo7, Am7, Cm6, Dm7, Bm7b5, Em7b5"
```

### `Key.analyzeChord`

`analyzeChord(key: string, chord: string, options?: { previous?: string, next?: string }) => ChordReading[]`

What a chord does in a key: every reading, ranked, the first being the default. The key is `"C major"`, `"A minor"` or a tonic alone (major). The neighbours are optional, but some readings need them:

```js
Key.analyzeChord("C major", "A7", { next: "Dm7" })[0];
// => {
//   chord: "A7",
//   numeral: "V7/ii",        // as the books write it
//   degree: "VI7",           // the chord's numeral on the tonic
//   source: "secondary dominant",
//   function: "D",           // "T", "SD", "D" or ""
//   scale: "",               // the scale it comes from, for diatonic and borrowed chords
//   target: "ii",            // the numeral it leads to
//   resolution: "functioning", // does the next chord go to the target?
//   chordScale: "A mixolydian b6",
// }
```

The same chord can be several things. `Bb7` before `C` in C major is a backdoor dominant, a chord borrowed from C minor and a tritone substitute of `E7`:

```js
Key.analyzeChord("C major", "Bb7", { next: "C" }).map((r) => r.source);
// => ["backdoor", "borrowed", "tritone substitute"]
Key.analyzeChord("C major", "Am7", { next: "D7" }).map((r) => r.numeral);
// => ["ii7/V", "vi7"]
```

The readings, by source:

| Source                   | Rule                                                                                                   | Example in C major                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `diatonic`               | every note in a scale of the key (minor: natural, harmonic, melodic), root on a degree                 | `Dm9` is `ii9`                                                  |
| `secondary dominant`     | a dominant or major triad a fifth above a degree whose chord is major or minor, not the tonic          | `A7` is `V7/ii`, `E` is `V/vi`                                  |
| `tritone substitute`     | a dominant a half step above one of those degrees or the tonic                                         | `Db7` is `subV7/I`                                              |
| `related ii`             | a m7 or m7b5 a fifth above a next chord that is a secondary dominant                                   | `Am7` before `D7` is `ii7/V`                                    |
| `borrowed`               | in the parallel key, or in a parallel mode when nothing else reads the chord                           | `Fm7` is `iv7` (C minor), `Bbmaj7` is `bVIImaj7` (C mixolydian) |
| `backdoor`               | a dominant a whole step below the tonic, before the tonic                                              | `Bb7` before `C`                                                |
| `passing diminished`     | a dim7 a half step below a next chord on a degree, or between two chords a whole step apart going down | `C#o7` before `Dm7` is `viio7/ii`; `Em7 Ebo7 Dm7`               |
| `common-tone diminished` | a dim7 on the root of the chord before or after                                                        | `Co7` before `C`                                                |
| `chromatic`              | nothing else matches                                                                                   | `F#maj7` is `#IVmaj7`                                           |

Readings the neighbours confirm come first (the next chord on the target, a related ii, a backdoor or diminished chord, a secondary dominant after its related ii), then the sources in the order of the table. The vi of a major key before the V is `"SD"` instead of `"T"`.

Every numeral but `subV` gives the chord back with `Progression.fromRomanNumerals`. Lowercase numerals are minor or diminished chords (`ii7` is `Dm7`, `viio` is `Bdim`).

To analyse a progression, pass each chord its neighbours:

```js
const chords = ["Cmaj7", "A7", "Dm7", "G7"];
chords.map(
  (chord, i) =>
    Key.analyzeChord("C major", chord, {
      previous: chords[i - 1],
      next: chords[i + 1],
    })[0].numeral,
);
// => ["Imaj7", "V7/ii", "ii7", "V7"]
```

The key stays the same for every chord: finding the local keys of a progression (a ii-V-I in another key) is not part of it.

### `Key.borrowedChords`

`borrowedChords(key: string) => { chord, numeral, from, replaces }[]`

The chords a key borrows from its parallel scales (modal interchange), with the scale they come from and the numerals of the key's chords they replace. Major keys follow Pease's tables (_Jazz Composition_); minor keys borrow from the parallel major: Imaj7 (the Picardy 3rd), iim7 for ii7b5, IVmaj7 for IV7.

```js
Key.borrowedChords("C major").map((b) => b.chord);
// => ["Dm7b5", "Ebmaj7", "Fm7", "Fm6", "Gm7", "Abmaj7", "Bb7", "Dbmaj7", "Bbmaj7", "Cmaj7#11"]
Key.borrowedChords("C major")[5];
// => { chord: "Abmaj7", numeral: "bVImaj7", from: "C minor", replaces: ["iv"] }
Key.borrowedChords("A minor").map((b) => b.chord); // => ["Amaj7", "Bm7", "Dmaj7"]
```

### `Key.substitutes`

`substitutes(key: string, chord: string, options?: { next?, kinds?, minor? }) => { chords: string[], kind: string }[]`

`Chord.substitutes` in a key, plus the key's own: `"diatonic"`, the key's chords with the same harmonic function (iii and vi for I, ii for IV, vii for V), and `"borrowed"`, the borrowed chords that replace it. The related ii of a dominant to a minor chord of the key is an m7b5.

```js
Key.substitutes("C major", "Fmaj7").map((s) => `${s.kind}: ${s.chords}`);
// => ["contained: Am", "diatonic: Dm7", "borrowed: Ebmaj7", "borrowed: Fm7", "borrowed: Fm6", "borrowed: Bbmaj7"]
Key.substitutes("C major", "E7", { kinds: ["related ii"] });
// => [{ chords: ["Bm7b5", "E7"], kind: "related ii" }]
```

### `Key.pivotChords`

`pivotChords(from: string, to: string, options?: { sevenths?: boolean, chromatic?: boolean }) => { chord, from, to, fromSource, toSource }[]`

The chords two keys share, to modulate from one to the other, with the numeral of each in both keys. Triads by default, 7th chords with `sevenths`; a minor key has the chords of its natural, harmonic and melodic forms. Chords are spelled as in the second key:

```js
Key.pivotChords("C major", "G major").map(
  (p) => `${p.chord}: ${p.from} ${p.to}`,
);
// => ["C: I IV", "Em: iii vi", "G: V I", "Am: vi ii"]
Key.pivotChords("C major", "G major", { sevenths: true }).map((p) => p.chord); // => ["Cmaj7", "Em7", "Am7"]
```

With `chromatic`, also the chords of one key that have a functional reading in the other (a secondary dominant, a chord borrowed from the parallel major or minor), with the source of each reading:

```js
Key.pivotChords("C major", "G major", { chromatic: true })
  .slice(4)
  .map((p) => `${p.chord}: ${p.from} ${p.to}`);
// => ["Dm: ii v", "F: IV bVII", "D: V/V V"]
```

## How to...

### How to get minor tonic from key signature

```js
Key.majorKey(Key.majorTonicFromKeySignature("###")).minorRelative; // => "F#"
```
