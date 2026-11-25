# Keys

> Key scales and chords

> **Try it:** [Key explorer](https://tonaljs.github.io/tonal/apps/key-explorer/). Click a key on the circle of fifths to get its signature, scale and chords: diatonic chords with their functions, secondary and substitute dominants with their ii, chord scales, and the related keys. Major and the three minor scales.

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
    substituteDominants: ["Db7", "", "", "Gb7", "Ab7", "A7", "Cb7"],
    substituteDominantSupertonics: ["Abm7", "", "", "Dbm7", "Ebm7", "Em7", "Gbm7"],
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
// => "Cm7, Dm7b5, Ebmaj7, Fm7, Gm7, Abmaj7, Bb7, G7, C7, D7, Eb7, F7, Gm7b5, Am7b5, Bbm7, Db7, Gb7, Ab7, A7, Cb7, Abm7, Dbm7, Ebm7, Em7, Gbm7, CmMaj7, Eb+maj7, Bo7, Am7, Cm6, Dm7, Bm7b5, Em7b5"
```

## How to...

### How to get minor tonic from key signature

```js
Key.majorKey(Key.majorTonicFromKeySignature("###")).minorRelative; // => "F#"
```
