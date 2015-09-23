# Binary set module

A binary set is a 12 digit binary number that represents a pitch class set.

The first time I've read about it was in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanation is extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

> The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### 2048 scales

All the scales have root, so the smallest scale is '100000000000' (2048) and
the biggest is '111111111111' (4095), so the total number is 2048 (4096 - 2048)

The way to get them all is with the function [`binary-set/allBinarySets`](#binarysetallbinarysets).

Most of they are not interesting enough to be used in music.
For example, at [allthescales.org site](http://allthescales.org) they limit all the possibilities to those with leap < 5 (1490)
