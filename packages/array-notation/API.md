## `interval.parse`

Parse a [interval shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
to [interval coord notation](https://github.com/danigb/music.array.notation)

This function is cached for better performance.

### Parameters

* `interval` **`String`** the interval string


### Examples

```js
var parse = require('array-notation/interval/parse')
parse('3m') // => [2, -1, 0]
parse('9b') // => [1, -1, 1]
parse('-2M') // => [6, -1, -1]
```

Returns `Array` the interval in array notation or null if not a valid interval


## `interval.str`

Get a string with a [shorthand interval notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
from interval in [array notation](https://github.com/danigb/music.array.notation)

The returned string has the form: `number + quality` where number is the interval number
(positive integer for ascending intervals, negative integer for descending intervals, never 0)
and the quality is one of: 'M', 'm', 'P', 'd', 'A' (major, minor, perfect, dimished, augmented)

### Parameters

* `interval` **`Array`** the interval in array notation


### Examples

```js
var str = require('array-notation/interval/str')
str([1, 0, 0]) // => '2M'
str([1, 0, 1]) // => '9M'
```

Returns `String` the interval string in shorthand notation or null if not valid interval


## `note.parse`

Get a pitch in [array notation]()
from a string in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)

The string to parse must be in the form of: `letter[accidentals][octave]`
The accidentals can be up to four # (sharp) or b (flat) or two x (double sharps)

This function is cached for better performance.

### Parameters

* `str` **`String`** the string to parse


### Examples

```js
var parse = require('array-notation/note/parse')
parse('C') // => [ 0 ]
parse('c#') // => [ 8 ]
parse('c##') // => [ 16 ]
parse('Cx') // => [ 16 ] (double sharp)
parse('Cb') // => [ -6 ]
parse('db') // => [ -4 ]
parse('G4') // => [ 2, 3, null ]
parse('c#3') // => [ 8, -1, null ]
```

Returns `Array` the note in array notation or null if not valid note


## `note.regex`

A regex for matching note strings.

The note string should have the form `letter[accidentals][octave][/duration]`
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
```



## `note.str`

Get [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) string
from pitch in [array notation]()

Array length must be 1 or 3 (see array notation documentation)

The returned string format is `letter[+ accidentals][+ octave][/duration]` where the letter
is always uppercase, and the accidentals, octave and duration are optional.

This function is memoized for better perfomance.

### Parameters

* `arr` **`Array`** the note in array notation


### Examples

```js
var str = require('array-notation/note/str')
str([0]) // => 'F'
str([0, 4]) // => null (its an interval)
str([0, 4, null]) // => 'F4'
str([0, 4, 2]) // => 'F4/2'
```

Returns `String` the note in scientific notation or null if not valid note array


## `pitch.parse`

Convert a note or interval string to a [pitch in coord notation]()

### Parameters

* `pitch` **`String`** the note or interval to parse


### Examples

```js
var parse = require('array-notation/pitch/parse')
parse('C2') // => [0, 2, null]
parse('5P') // => [1, 0]
```

Returns `Array` the pitch in array notation


## `pitch.str`

Convert a pitch in coordinate notation to string. It deals with notes, pitch
classes and intervals.

### Parameters

* `pitch` **`Array`** the pitch in array notation


### Examples

```js
var str = require('array-notation/pitch.str')
// pitch class
str([0]) // => 'C'
// interval
str([0, 0]) // => '1P'
// note
str([0, 2, 4]) // => 'C2/4'
```

Returns `String` the pitch string


## `roman.memoize`

Roman to coordinate: convert from [roman numerals](https://en.wikipedia.org/wiki/Roman_numeral_analysis)
to [pitch coordinates]()

### Parameters

* `str` **`String`** the roman numeral string


### Examples

```js
var parse = require('array-notation/roman.memoize')
parse('V') // => [1]
parse('bII') // => [-5]
```

Returns `Array` a coord or null if not valid roman numeral literal


## `roman.regex`

A regex to match roman numbers literals with the from:
`[accidentals]roman[element]` where:

accidentals: (Optional) one or two flats (b) or shaprs (#)
roman: (Required) a roman numeral from I to VII either in upper or lower case
element: (Optional) a name of an element



### Examples

```js
var r = require('array-notation/roman/regex')
r.exec('bVII')
r.exec('IVMaj7')
r.exec('ii minor')
```



