# @tonaljs/chord

## API

### `chord(name: string) => Scale`

Get a chord from a chord name. Unlike `chordType`, `chord` accepts tonics in the chord name and returns the chord type with more properties:

- tonic: the tonic of the chord, or "" if not present
- notes: an array of notes, or empty array if tonic is not present
- quality:

  See [chord-dictionary](../chord-dictionary) for more details.

```js
```

### `transpose(chordName: string, intervalName: string) => string`

Transpose a chord name by an interval:

```js
transpose("Eb7b9", "5P"); // => "Bb7b9"
```

### `chordScales(chordName: string) => string[]`

Get all scales wheree the given chord fits

```js
chordScales("C7b9");
// => ["phrygian dominant", "flamenco", "spanish heptatonic", "half-whole diminished", "chromatic"]
```

### `extended(chord: string) => string[]`

Get all chords names that are a superset of the given one (has the same notes and at least one more)

```js
extended("Cmaj7");
// => [ 'Cmaj#4', 'Cmaj7#9#11', 'Cmaj9', 'CM7add13', 'Cmaj13', 'Cmaj9#11', 'CM13#11', 'CM7b9' ]
```

### `reduced(chord: string) => string[]`

Find all chords names that are a subset of the given one (less notes but all from the given chord)

```js
Scale.reduced("Cmaj7"); // => ["C5", "CM"]
```
