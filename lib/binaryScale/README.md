# Binary scale module

A binary scale is a 12 digit binary number where the first number is a `1`, and it's used to represent scales (or, in fact, any pitch class set). It's a handy representation to compare scales (and see if they are different spellings of the same scale, for example) or get scale properties like the biggest distance between scale degrees:

```js
var binaryScale = require('tonal/binaryScale')
// compare two scales
binaryScale.fromCollection('C D E G') === binaryScale.fromCollection('C D Fb Abb') // true
// get the biggest distance between scale degrees
binaryScale.props(binaryScale.fromCollection('C D E F G A B')).leap // => 2
```

The first time I've read about it was in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanation is extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

> The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### Filter scales

If we consider all binary numbers to be valid scales, and considering that all the scales have root,
so the smallest scale is '100000000000' (2048) and the biggest is '111111111111' (4095),
the total number of scales is 2048 (4096 - 2048)

The way to get them all is with the function [`binary-scale/filter`](#binaryscalefilter).

If we define scales like [this](http://2012books.lardbucket.org/books/music-theory/s08-01-scales-and-scale-steps.html):

> five or more pitches arranged in sequential patterns of whole steps and half steps

we can get the all the binary scale numbers like this:

```js
binaryScale.filter(function (binary) {
  var props = binaryScale.props(binary)
  return props.length > 4 && props.leap < 2
}
```
