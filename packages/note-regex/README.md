# note-regex

A regex for matching note or pitched elements.

The string should have the form `letter[accidentals][octave][/duration]`
where:

- letter: (Required) is a letter from A to G either upper or lower case
- accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
They can NOT be mixed.
- octave: (Optional) a positive or negative integer
- duration: (Optional) anything follows a slash `/` is considered to be the duration
- element: (Optional) additionally anything after the duration is considered to
be the element name (for example: 'C2 dorian')

### Examples

```js
var R = require('note-regex')
R.exec('c#4') // => ['c#4', 'c', '#', '4', '', '']
R.exec('fx4/2') // => ['fx4/2', 'f', 'x', '4', '2', '']
R.exec('BbMaj7') // => [ 'BbMaj7', 'B', 'b', '', '', 'Maj7' ]
```
