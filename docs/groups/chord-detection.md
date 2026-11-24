# Chord detection

> Find the chord names of a list of notes

> **Try it:** [Chord finder](https://tonaljs.github.io/tonal/apps/chord-finder/). Play or type some notes to get the chord name, or type a chord symbol to get its notes.

## API

### `Chord.detect(notes: string[], options?: { assumePerfectFifth?: boolean, missingFifth?: boolean, exclude?: string[] }) => string[]`

Get the chord names of a list of notes, most likely first. Examples:

```js
Chord.detect(["D", "F#", "A", "C"]); // => ["D7"]
Chord.detect(["F#", "A", "C", "D"]); // => ["D7/F#"]
Chord.detect(["A", "C", "D", "F#"]); // => ["D7/A"]
Chord.detect(["E", "G#", "B", "C#"]); // => ["E6", "C#m7/E"]
```

The bass is the first note, or the lowest one when every note has an octave, so the order of notes with octaves doesn't matter:

```js
Chord.detect(["A3", "C4", "F3"]); // => ["FM", "Am#5/F"]
Chord.detect(["A", "C", "F"]); // => ["FM/A", "Am#5"]
```

A chord with a third and a seventh is often played without its fifth. When the notes over a root have no name, but have one with a perfect fifth added, they're named after that chord with `no5`. Chord types without fifth that are listed keep their name (`C7no5`, `C9no5`):

```js
Chord.detect(["C", "E", "B"]); // => ["Cmaj7no5"]
Chord.detect(["C", "Eb", "Bb", "D"]); // => ["Cm9no5"]
Chord.detect(["C", "E", "Bb", "D"]); // => ["C9no5"]
```

Names are ranked:

1. Chords over the bass, then inversions (slash chords), then chords without their fifth (`Cmaj7no5`, then `Cmaj7no5/E`).
2. Unusual readings go last, after inversions. A reading is unusual (a rule adapted from [sharp11](https://github.com/jsrmath/sharp11)) when it has no perfect fifth and doesn't state an altered one (except dominant chords without fifth, like `C7no5`), when it has a fifth, a minor third and a minor sixth, when it's a sixth chord with an added fourth, or when it's the diminished seventh with a major seventh (`o7M7`). So E G C is C major in first inversion, not `Em#5`, and C F Bb Eb is `F7sus4/C`, not the quartal chord:

```js
Chord.detect(["E4", "G4", "C5"]); // => ["CM/E", "Em#5"]
Chord.detect(["E", "G", "B", "C"]); // => ["Cmaj7/E", "Emb6"]
Chord.detect(["C", "F", "Bb", "Eb"]); // => ["F7sus4/C", "Bbsus24/C", "Cquartal"]
```

3. Among names with the same notes over the same root, the one whose intervals spell the given notes goes first:

```js
Chord.detect(["Eb", "G", "B", "D"]); // => ["Ebmaj7#5", "EbM7b6", ...]
Chord.detect(["Eb", "G", "Cb", "D"]); // => ["EbM7b6", "Ebmaj7#5", ...]
```

Every name parses back with `Chord.get` to the same notes and bass.

This function is also exposed in [`Chord`](https://tonaljs.github.io/tonal/docs/groups/chords.md) module.

#### Options

- `assumePerfectFifth`: names a chord whose fifth is missing as if it had it, without `no5`

```js
detect(["D", "F", "C"], { assumePerfectFifth: true }); // => ["Dm7"]
detect(["D", "F", "C"], { assumePerfectFifth: false }); // => ["Dm7no5"]
```

- `missingFifth`: `false` leaves out the chords without their fifth, so every name is a listed chord type (`true` by default)

```js
detect(["D", "F", "C"], { missingFifth: false }); // => []
```

- `exclude`: chord types to leave out, by name or alias

```js
detect(["C", "F", "Bb", "Eb"], { exclude: ["quartal"] }); // => ["F7sus4/C", "Bbsus24/C", "Cm7add11no5"]
```
