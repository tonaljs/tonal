## `accidentals.str`

Build an accidentals string from alteration number

### Parameters

* `alteration` **`Integer`** the alteration number


### Examples

```js
var accidentals = require('music-notation/accidentals/str')
accidentals(0) // => ''
accidentals(1) // => '#'
accidentals(2) // => '##'
accidentals(-1) // => 'b'
accidentals(-2) // => 'bb'
```

Returns `String` the accidentals string


## `array.fromProps`

Get a pitch in [array notation]() from pitch properties

### Parameters

* `step` **`Integer`** the step index
* `alterations` **`Integer`** (Optional) the alterations number
* `octave` **`Integer`** (Optional) the octave
* `duration` **`Integer`** (Optional) duration


### Examples

```js
var fromProps = require('music-notation/array/from-props')
fromProps([0, 1, 4, 0])
```

Returns `Array` the pitch in array format


## `array.toProps`

Get properties from a pitch in array format

The properties is an array with the form [number, alteration, octave, duration]

### Parameters

* `array` **`Array`** the pitch in coord format


### Examples

```js
var toProps = require('music-notation/array/to-props')
toProps([2, 1, 4]) // => [1, 2, 4]
```

Returns `Array` the pitch in property format


## `exports`

Given an accidentals string returns its alteration number

### Parameters

* `accidentals` **`String`** the accidentals string
* `skipValidation` **`boolean`** true to skip validation





## `interval`

Get a interval from a string (or null if not valid interval)

### Parameters

* `src` **`String`** the source


### Examples

```js
interval = require('music-notation/interval/interval')
interval('2M') // => '2M'
interval('2') // => '2M'
interval('2m') // => '2m'
interval('2b') // => '2m'
interval('C') // => null
```

Returns `String` the interval in short notation


## `interval.parse`

Parse a [interval shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
to [interval coord notation](https://github.com/danigb/music.array.notation)

This function is cached for better performance.

### Parameters

* `interval` **`String`** the interval string


### Examples

```js
var parse = require('music-notation/interval/parse')
parse('3m') // => [2, -1, 0]
parse('9b') // => [1, -1, 1]
parse('-2M') // => [6, -1, -1]
```

Returns `Array` the interval in array notation or null if not a valid interval


## `interval.regex`

A regex for parse intervals in shorthand notation

Three different shorthand notations are supported:

- default [direction][number][quality]: the preferred style `3M`, `-5A`
- strict: [quality][direction][number], for example: `M3`, `A-5`
- altered: [direction][number][alterations]: `3`, `-5#`






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
var str = require('music-notation/interval/str')
str([1, 0, 0]) // => '2M'
str([1, 0, 1]) // => '9M'
```

Returns `String` the interval string in shorthand notation or null if not valid interval


## `note`

Get a note from a string (or null if not valid note)

### Parameters

* `src` **`String`** the source


### Examples

```js
note = require('music-notation/note/note')
note('fx2') // => 'F##2'
note('bbb') // => 'Bbb'
note('blah') // => null
```

Returns `String` the note in scientific notation


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
var parse = require('music-notation/note/parse')
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

A regex for matching note strings in scientific notation.

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
var R = require('music-notation/note/regex')
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
var str = require('music-notation/note/str')
str([0]) // => 'F'
str([0, 4]) // => null (its an interval)
str([0, 4, null]) // => 'F4'
str([0, 4, 2]) // => 'F4/2'
```

Returns `String` the note in scientific notation or null if not valid note array


## `operation`

Decorate a function to work with intervals, notes or pitches in
[array notation](https://github.com/danigb/tonal/tree/next/packages/music-notation)
with independence of string representations.

This is the base of the pluggable notation system of
[tonal](https://github.com/danigb/tonal)

### Parameters

* `parse` **`Function`** the parser
* `str` **`Function`** the string builder
* `fn` **`Function`** the operation to decorate


### Examples

```js
var parse = require('music-notation/interval/parse')
var str = require('music-notation/interval/str')
var operation = require('music-notation/operation')(parse, str)
var add = operation(function(a, b) { return [a[0] + b[0], a[1] + b[1]] })
add('3m', '3M') // => '5P'
```



## `pitch`

Get a pitch from a string. In tonal a pitch it's a note, an interval or a
pitch class. It allows us to work with this elements in an uniform way.

### Parameters

* `source` **`String`** the string


### Examples

```js
var pitch = require('music-notation/pitch/pitch')
pitch('c2') // => 'C2'
pitch('2') // => '2M'
pitch('blah') // => null
```

Returns `String` the pitch or null if not a valid pitch


## `pitch.parse`

Convert a note or interval string to a [pitch in coord notation]()

### Parameters

* `pitch` **`String`** the note or interval to parse


### Examples

```js
var parse = require('music-notation/pitch/parse')
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
var str = require('music-notation/pitch.str')
// pitch class
str([0]) // => 'C'
// interval
str([0, 0]) // => '1P'
// note
str([0, 2, 4]) // => 'C2/4'
```

Returns `String` the pitch string


## `roman.parse`

Roman to coordinate: convert from [roman numerals](https://en.wikipedia.org/wiki/Roman_numeral_analysis)
to [music-notation]()

### Parameters

* `str` **`String`** the roman numeral string


### Examples

```js
var parse = require('music-notation/roman.parse')
parse('V') // => [1]
parse('bII') // => [-5]
```

Returns `Array` the roman number in array-notation or null if not valid numeral


## `roman.regex`

A regex to match roman numbers literals with the from:
`[accidentals]roman[element]` where:

accidentals: (Optional) one or two flats (b) or shaprs (#)
roman: (Required) a roman numeral from I to VII either in upper or lower case
element: (Optional) a name of an element



### Examples

```js
var r = require('music-notation/roman/regex')
r.exec('bVII')
r.exec('IVMaj7')
r.exec('ii minor')
```



