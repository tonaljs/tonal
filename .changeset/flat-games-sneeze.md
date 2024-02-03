---
"@tonaljs/chord": major
"tonal": major
---

#### Breaking change: chord uses pitch classes, never notes with octaves

- Breaking change: chords uses only pitch classes. Before `Chord.getChord('M', 'C4')` would consider `C4` to be the tonic and now is `C``

So **before**:

```js
Chord.get("M", "C4"); // =>
// {
//   name: 'C4 major',
//   tonic: 'C4',
//   notes: [ 'C4', 'E4', 'G4' ]
// ...
// }
```

**Now**:

```js
Chord.get("M", "C4"); // =>
// {
//   name: 'C major',
//   tonic: 'C',
//   notes: [ 'C', 'E', 'G' ]
// }
```

### Feature: slash chords

- Chord now accepts a slash and a bass. The bass _must_ be a pitch class
- Chord properties include `bass` that is a pitch class that could or could not belong to the chord itself.

Example:

```js
Chord.get("Cmaj7/B");
Chord.get("Eb/D");
```

### Feature: chord `notes`

Now `notes` property of a chord are always pitch classes, there's a new function to get the actual notes:

```js
Chord.notes("Cmaj7", "C4"); // => ['C4', 'E4', 'G4', 'B4']
Chord.notes("maj7", "D5"); // => ['D5', 'F#5', 'A5', 'C#6']
```
