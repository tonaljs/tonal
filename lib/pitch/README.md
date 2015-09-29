# Pitch module

This is the building block of tonal. Pitches are just strings in scientific notation. You can create it from midi numbers or frequencies (and reverse), query for its properties, transpose them or find interval distances. Almost everything you need from pitches is here.

### Working with midi and frequencies

You can use `pitch/fromMidi` and `pitch/toMidi` to midi-pitch conversion:

```js
var fromMidi = require('tonal/pitch/fromMidi')
fromMidi(69) // => 'A4'
var toMidi = require('tonal/pitch/toMidi')
toMidi('C') // => 60
```

The same works with `pitch/fromFreq` and `pitch/toFreq`.

Additionally the `pitch/cents` function allow to calculate the distance in cents between frequencies or pitches:

```js
var cents = require('tonal/pitch/cents')
c('A4', 446) // => 23.44
```

### Pitch properties

Use `pitch/props` to get the properties of a pitch:

```js
var props = require('tonal/pitch/props')
props('c#2').pitchClass // => 'C#'
```

Here is the properties list and examples:

| Prop name  | Description | c#2 | bbb | Bx6 |
|---|---|-----|-----|-----|
|name| The provided string |c#2 | bbb | Bx6 |
|sci| Scientific notation | C#2 | Bbb4 | B##6 |
|letter| Pitch letter | C | B | B |
|pitchClass| Pitch class | C# | Bbb | B## |
|chroma| Pitch class integer | 1 | 9 | 1 |
|acc| Accidentals | # | bb | ## |
|alter| Accidentals integer | 1 | -2 | 2 |
|oct| Octave | 2 | 4 | 6 |
|midi| Midi number | 37 | 69 | 97 |

### Transposition and distances

You can use `pitch/transpose` to transpose a pitch and `pitch/interval` to find the interval between two pitches:

```js
var transpose = require('tonal/pitch/transpose')
['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
```

### Resources

- Music Theory Book: http://2012books.lardbucket.org/books/music-theory/s07-the-elements-of-pitch-sound-sy.html
