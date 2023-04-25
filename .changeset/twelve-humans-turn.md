---
"@tonaljs/chord-type": major
"@tonaljs/chord": major
"tonal": major
---

Breaking change: `Chord.get` and `Chord.tokenize` now includes all numbers as part of the chord type when passing a single string.

In v4.x:

```js
Chord.get("C4maj7"); // => { symbol: 'Cmaj7', tonic: 'C4' ... }
```

In v5.x:

```js
Chord.get("C4maj7"); // => { empty: true ... }
```

The old behaviour can be obtained by using an array. This works both in v4.x and v5.x:

```js
Chord.get(["C4", "maj7"]); // => { symbol: 'Cmaj7', tonic: 'C4' ... }
```

The reasons for this change are:

1. Chord symbols never use octaves
2. The old behavior is confusing and arbitrary
