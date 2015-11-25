## `chord`

Get a chord by name using a dictionary.

There is two ways to get a chord:

- With type and tonic: `chord.chord('Maj7', 'C')`
- With tonic included in name: `chord.chord('CMaj7')`

To get chord intervals use  `false` as tonic

This function can be partially applied (see examples)

### Parameters

* `name` **`String`** the chord name (optionally can include the tonic)


### Examples

```js
var chord = require('music.chord')
// with name and tonic
chord('Maj7', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// with tonic inside the name
chord('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// partially applied
var major = chord('major')
major('C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

Returns `Object` a data object with the chord properties


## `chord`

In music.kit an chord is a list of notes or intervals ordered
by pitch

The `chord` module has functions to create and manipulate chord



### Examples

```js
var kit = require('music.kit')
kit.chord('1 3 5 6', 'G') // => ['G', 'B', 'D', 'E']
kit.chord.get('Cmaj7') // => ['C', 'E', 'G', 'B']
```



## `chord.build`

Create a chord from a source and a tonic. A chord is a list of notes or
intervals in asceding pitch order

The source can be a list of intervals or notes. The tonic must be
a pitch (with or without octave) or false to get the intervals

This function is currified, so you can partially apply the function passing
one parameter instead of two (see example)

### Parameters

* `source` **`Array`** the list of intervals or notes
* `tonic` **`String`** the tonic of the chord or null to get the intervals


### Examples

```js
var chord = require('music.chord')
chord.build('1 3 5 6', 'G') // => ['G', 'B', 'D', 'E']
// partially applied:
var maj79 = chord.build('C E G B D')
maj79('A4') // => ['A4', 'C#5', 'E5', 'G#5', 'B5']
```

Returns `Array` the chord notes (or intervals if null tonic)


## `chord.dictionary`

A chord dictionary

### Parameters

* `name` **`String`** the chord name


### Examples

```js
var chords = require('music.chord/dictionary')
chords('Maj7') // => { name: 'Maj7', intervals: ['1', '3', ...], aliases: [] }
```



## `chord.names`

Given a list of notes get the chord names

### Parameters

* `notes` **`String or Array`** the chord notes


### Examples

```js
var chord = require('music.chord')
chord.names() // => ['Maj7', 'm7', ... ] (109 names)
chord.names('D E F G A B C') [ 'D dorian' ]
chord.names('D E F G A B C') [ 'D dorian' ]
```

Returns `Array` an array of chord names or all known chord names if no arguments provided


## `chord.type`

Get the type of the chord (can be 'M', 'm', '7' or 'o' to represent major,
minot, dominant and dimished respectively)

It assumes that the chord is not inversed (first note is always the tonic)

It detects major, minor, augmented, diminished and dominant chords. All
chord notes beyond the 5th (except 7th for dominant chords) are ignored

### Parameters

* `chord` **`Array`** the chord notes


### Examples

```js
var chord = require('music.chord')
chord.type('C E G') // => 'M'
chord.type('C Eb G') // => 'm'
chord.type('C Eb Gb') // => 'dim'
chord.type('C E G#') // => 'aug'
chord.type('C E G B') // => 'M'
chord.type('C E G B7') // => '7'
```

Returns `String` the chord type ('M', 'm', '7', 'dim', 'aug' or null)


## `distance`

Get the interval between two pitches

If one or both are pitch classes, a simple ascending interval is returned

This function can be partially applied (see examples)

### Parameters

* `from` **`String or Array`** the first note
* `to` **`String or Array`** the other note


### Examples

```js
var distance = require('tonal.distance')
distance('C2', 'D3') // => '9M'
distance('D2', 'C2') // => '-2M'
distance('D', 'C') // => '7m'
```
```js
// partially applied
var fromC = distance('C')
fromC('D') // => '2M'
```

Returns  the interval between them


## `gamut`

In music.kit a gamut is a collection of intervals, pitch classes or notes.
Scales, chords, pitch sets are examples of gamuts.

### Parameters

* `source` **`String or Array`** a list of elements


### Examples

```js
gamut('c2 bb fx blah') // => ['C2', 'Bb', 'F##', null]
```

Returns `Array` a list of pitches


## `gamut.chord`

Create a chord from a source and a tonic. A chord is a list of notes or
intervals in asceding pitch order

The source can be a list of intervals or notes. The tonic must be
a pitch (with or without octave) or false to get the intervals

This function is currified, so you can partially apply the function passing
one parameter instead of two (see example)

### Parameters

* `source` **`Array`** the list of intervals or notes
* `tonic` **`String`** the tonic of the chord or null to get the intervals


### Examples

```js
var chord = require('tonal.gamut/chord')
chord.build('1 3 5 6', 'G') // => ['G', 'B', 'D', 'E']
// partially applied:
var maj79 = chord.build('C E G B D')
maj79('A4') // => ['A4', 'C#5', 'E5', 'G#5', 'B5']
```

Returns `Array` the chord notes (or intervals if null tonic)


## `gamut.harmonics`

Get the distances from the first note of a gamut to the rest of notes

Pitch classes are treated as notes with octave equal 0

### Parameters

* `gamut` **`String or Array`** the list of notes


### Examples

```js
gamut.harmonics('c2 e2 g2') // => ['1P', '3M', '5P']
```



## `gamut.operation`

Apply a function to an array of array pitches






## `gamut.rotate`

Rotate the gamut

### Parameters

* `count` **`Integer`** the number of rotations
* `gamut` **`String or Array`** a list of notes or intervals


### Examples

```js
var rotate = require('music.kit/gamut/rotate')
rotate(1, 'C D E') // => ['D', 'E', 'C']
```

Returns `Array` the gamut rotated count times


## `gamut.scale`

Create a scale from a gamut and a tonic. A scale is a set of notes or
intervals ordered by frequency with a tonic.

A source can be a list of intervals or notes.

The tonic can be a note (with or without octave), false to get the scale
intervals or null to set the first note of the source as tonic

This function is currified, so you can partially apply the function passing
one parameter instead of two (see example)

### Parameters

* `source` **`Array`** the list of intervals or notes
* `tonic` **`String`** the tonic of the scale


### Examples

```js
var scale = require('tonal.gamut/scale')
// basic usage
scale('1 2 3 5 6', 'G') // => ['G', 'A', 'B', 'D', 'E']
scale('1 2 3 5 6', false) // => ['1P', '2M', '3M', '5P', '6M']
```
```js
// uses first note of the source as tonic
scale('c d e f g a b c d e', null) // => []
```
```js
// partially applied
var dorian = scale('D E F G A B C')
dorian('C4') // => ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4']
```

Returns `Array` the list of notes


## `gamut.select`

Select some elements from a gamut

### Parameters

* `numbers` **`String or Array`** a __1-based__ index of the elements
* `gamut` **`String or Array`** the notes or intervals


### Examples

```js
var select = require('tonal.gamut/select')
select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
```

Returns `Array` the selected elements


## `gamut.set`

Create a set: a set is a list of uniq pitch classes or simplified intervals
in ascending pitch order

### Parameters

* `notes` **`String or Array`** the note list


### Examples

```js
var set = require('tonal.gamut/set')
set('E7 C2 e D5 c1') // => ['C', 'D', 'E']
set('11 10 9') // => [ '2M', '3M', '4P' ]
```

Returns  the set


## `gamut.sort`

Get a gamut in ascdening pitch order

### Parameters

* `gamut` **`String or Array`** the gamut to sort


### Examples

```js
var sort = require('music.kit/gamut.sort')
sort('c5 d2 f4 D2') // => ['D2', 'D2', 'F4', 'C5']
```

Returns `Array` the gamut in sort pitch order


## `gamut.split`

Convert a source to an array. If the source is an array, return it.

Aside from an array itself, the source can be a
string with elements separated by spaces, commas or bars (`|`) or a single
element that will be wrapped inside an array

This function __does not perform any transformation__ of the array elements.
and __it always return an array, even if its empty__.

### Parameters

* `source` **`String or Array`** the source


### Examples

```js
split = require('music.kit/gamut.split')
split('a | B C , Dmaj7') // => ['a', 'B', 'C', 'Dmaj7']
split() // => []
```

Returns `Array` the source as array


## `key`

Create a key from a string. A key is a string with a tonic and a mode



### Examples

```js
key('C major') // => 'C major'
key('c Major') // => 'C major'
key('C') // => 'C major'
key('dbb miXolydian') // => 'Dbb mixolydian'
```



## `key.altNotes`

Get a list of altered notes in the appropriate order

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.altNotes('F major') // => ['Bb']
key.altNotes('Eb major') // => ['Bb', 'Eb', 'Ab']
key.altNotes('A major') // => ['F#', 'C#', 'G#']
```

Returns `Array` an array with the altered notes ordered or an empty array
if its not a valid key name


## `key.build`

Build a key from key name

### Parameters

* `name` **`String`** the key name


### Examples

```js
var key = require('music.key')
key('C major') // => ['C', 'major']
key('fx MINOR') // => ['F##', 'minor']
key('Ab mixolydian') // => ['Ab', 'mixolydian']
key('f bebop') // => 'null'
```

Returns `Array` an array with the tonic and mode or null if not valid key


## `key.chords`

Get chords of a key

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.chords('C major') // => ['C', 'Dm', 'Em', 'F', 'G7', 'Am', 'Bo'
key.chords('major', false) // => ['C', 'Dm', ...]
```

Returns `Array` an array with the key chords


## `key.progression`

Get a chord progression from within a key

### Parameters

* `numerals` **`String or Array`** the roman numerals
* `key` **`String`** the key name





## `key.relative`

Get relative of a key

### Parameters

* `relative` **`String`** the name of the relative mode desired
* `key` **`String`** the key name


### Examples

```js
key.relative('minor', 'C major') // => 'A minor'
key.relative('major', 'A minor') // => 'C major'
key.relative('dorian', 'F major') // => 'G dorian'
```

Returns `String` the relative key name or null if the key or the relative name
are not valid


## `key.scale`





### Examples

```js
key.scale('C major') // => ['C', 'D', 'E', ...]
```



## `key.signature`

Get signature of a key

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.signature('F major') // => 'b'
key.signature('Eb major') // => 'bbb'
key.signature('A major') // => '###'
key.signature('C major') // => ''
key.signature('nonsense') // => null
```

Returns `String` a string with the alterations


## `key.signature`

Get the number of alterations of a key

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.signature('C major') // => 0
key.signature('F major') // => -1
key.signature('Eb major') // => -3
key.signature('A major') // => 3
key.signature('nonsense') // => null
```

Returns `Integer` the number of alterations or null if not valid key


## `notation.interval`

Get a interval from a string (or null if not valid interval)

### Parameters

* `src` **`String`** the source


### Examples

```js
interval = require('tonal.notation/interval')
interval('2M') // => '2M'
interval('2') // => '2M'
interval('2m') // => '2m'
interval('2b') // => '2m'
interval('C') // => null
```

Returns `String` the interval in short notation


## `notation.interval.parse`

Parse a [interval shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
to [interval coord notation](https://github.com/danigb/music.array.notation)

This function is cached for better performance.

### Parameters

* `interval` **`String`** the interval string


### Examples

```js
var parse = require('tonal.notation/interval.parse')
parse('3m') // => [2, -1, 0]
parse('9b') // => [1, -1, 1]
parse('-2M') // => [6, -1, -1]
```

Returns `Array` the interval in array notation or null if not a valid interval


## `notation.interval.str`

Build a string with [shorthand interval notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation)
from an interval in [array notation](https://github.com/danigb/music.array.notation)

The returned string has the form: `number + quality` where number is the interval number
(positive integer for ascending intervals, negative integer for descending intervals, never 0)
and the quality is one of: 'M', 'm', 'P', 'd', 'A' (major, minor, perfect, dimished, augmented)

### Parameters

* `interval` **`Array`** the interval in array notation


### Examples

```js
var str = require('tonal.notation/cti')
str([1, 0, 0]) // => '2M'
str([1, 0, 1]) // => '9M'
```

Returns `String` the interval string in shorthand notation or null if not valid interval


## `notation.note`

Get a note from a string (or null if not valid note)

### Parameters

* `src` **`String`** the source


### Examples

```js
note = require('tonal.notation/note')
note('fx2') // => 'F##2'
note('bbb') // => 'Bbb'
note('blah') // => null
```

Returns `String` the note in scientific notation


## `notation.note.parse`

Get a pitch in [coord pitch notation](https://github.com/danigb/music.array.notation)
from a string in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)

The string to parse must be in the form of: `letter[accidentals][octave]`
The accidentals can be up to four # (sharp) or b (flat) or two x (double sharps)

This function is cached for better performance.

### Parameters

* `str` **`String`** the string to parse


### Examples

```js
var parse = require('tonal.notation/note.parse')
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


## `notation.note.split`

Split a note string into its parts

It returns an array with:

- 0: the complete string
- 1: the note letter
- 2: the accidentals
- 3: the octave
- 4: the duration
- 5: the element name

### Parameters

* `source` **`String`** the string to be parsed


### Examples

```js
var split = require('tonal.notation/note.split')
split('c#4') // => ['c#4', 'c', '#', '4', '', '']
```

Returns `Array` the parsed parts or null if not valid note


## `notation.note.str`

Get [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) string
from pitch in [coordinate notation]()

Array length must be 1 or 3 (see array notation documentation)

The returned string format is `letter[+ accidentals][+ octave][/duration]` where the letter
is always uppercase, and the accidentals, octave and duration are optional.

This function is memoized for better perfomance.

### Parameters

* `arr` **`Array`** the note in array notation


### Examples

```js
var str = require('tonal.notation/note.str')
str([0]) // => 'F'
str([0, 4]) // => null (its an interval)
str([0, 4, null]) // => 'F4'
str([0, 4, 2]) // => 'F4/2'
```

Returns `String` the note in scientific notation or null if not valid note array


## `notation.parser`

Decorate coordtinate conversion functions

It helps creating functions that convert from string to pitch in coordinate format.
Basically it does two things:
- ensure the function only receives strings
- memoize the result



### Examples

```js
var parser = require('tonal.notataion/parser')
var parse = parser(function (str) {
  // str is ALWAYS a string
  // the return value is memoized
})
```



## `notation.props`

Get properties from a pitch in coordinate format

The properties is an array with the form [number, alteration, octave, duration]

### Parameters

* `array` **`Array`** the pitch in coord format


### Examples

```js
var props = require('tonal.notation/props')
props([2, 1, 4]) // => [1, 2, 4]
```

Returns `Array` the pitch in property format


## `notation.props.coord`

Get a pitch in coordinate format from properties

### Parameters

* `prop` **`Array`** the pitch in property format



Returns `Array` the pitch in coordinate format


## `notation.roman.parser`

Roman to coordinate: convert from [roman numerals](https://en.wikipedia.org/wiki/Roman_numeral_analysis)
to [pitch coordinates]()

### Parameters

* `str` **`String`** the roman numeral string


### Examples

```js
var parse = require('tonal.notation/roman.parser')
parse('V') // => [1]
parse('bII') // => [-5]
```

Returns `Array` a coord or null if not valid roman numeral literal


## `notation.roman.split`

Split a roman numeral string into its parts.

Returns an array contains:

- 0: the complete string
- 1: the accidentals
- 2: the roman numeral
- 3: the structure name

### Parameters

* `source` **`String`** the string to parse


### Examples

```js
split('bVIIMaj9') // => ['bVIIMaj9', 'b', 'VII', 'Maj9']
```

Returns `Array` array - the string parts


## `note`

Get a note from a string (or null if the string is not a valid note).
In tonal a note is represented by a string with a note in scientific notation.

This is an alias of `notation.note`

### Parameters

* `src` **`String`** the source


### Examples

```js
note = require('tonal.note')
note('fx2') // => 'F##2'
note('bbb') // => 'Bbb'
note('blah') // => null
```

Returns `String` the note in scientific notation


## `note.distance`

Get the interval between two notes

If one or both notes are pitch classes, a simple ascending interval is returned

This function is an alias of `tonal.distance`

### Parameters

* `from` **`String or Array`** the first note
* `to` **`String or Array`** the other note


### Examples

```js
var distance = require('tonal.note/distance')
distance('C2', 'D3') // => '9M'
distance('D2', 'C2') // => '-2M'
distance('D', 'C') // => '7m'
```

Returns  the interval between them


## `note.enharmonics`

Get the enharmonics of a note. It returns an array of three elements: the
below enharmonic, the note, and the upper enharmonic

### Parameters

* `pitch` **`String`** the pitch to get the enharmonics from


### Examples

```js
enharmonics = require('tonal.note/enharmonics')
enharmonics('C') // => ['B#', 'C', 'Dbb']
enharmonics('A') // => ['G##', 'A', 'Bbb']
enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
```

Returns `Array` an array of pitches ordered by distance to the given one


## `note.freq`

Get the pitch frequency in herzs with custom concert tuning

This function is currified so it can be partially applied (see examples)

### Parameters

* `tuning` **`Float`** the frequency of A4 (null means 440)
* `note` **`String or Array`** the note name


### Examples

```js
note.freq(null, 'A4') // => 440
note.freq(444, 'A4') // => 444
```
```js
// partially applied
['A4', 'A#4', 'B5'].map(note.freq(440)) // => [440, ...]
var baroque = note.freq(415)
baroque('A3') // => 207.5
```

Returns `Float` the frequency of the note


## `note.fromMidi`

Get the note name (in scientific notation) of the given midi number

It uses MIDI's [Tuning Standard](https://en.wikipedia.org/wiki/MIDI_Tuning_Standard)
where A4 is 69

This method doesn't take into account diatonic spelling. Always the same
pitch class is given for the same midi number.

### Parameters

* `midi` **`Integer`** the midi number


### Examples

```js
note.fromMidi(69) // => 'A4'
```

Returns `String` the pitch


## `note.midi`

Get the midi number of a note

The note can be an string in scientific notation or
[array pitch notation](https://github.com/danigb/music.array.notation)

### Parameters

* `note` **`String or Array`** the note in string or array notation


### Examples

```js
midi('A4') // => 69
midi('A3') // => 57
midi([0, 2]) // => 36 (C2 in array notation)
```

Returns `Integer` the midi number


## `note.pitchClass`

Get the [pitch class](https://en.wikipedia.org/wiki/pitch_class) of a note

### Parameters

* `note` **`String or Array`** the note


### Examples

```js
pc = require('tonal.note/pitchClass')
pc('db3') // => 'Db'
pc('fx/4') // => 'F##'
```

Returns  the pitch class


## `note.setOctave`

Set the octave of the given note

### Parameters

* `octave` **`Integer`** the octave to set
* `note` **`String or Array`** the note


### Examples

```js
var setOctave = require('tonal.note/setOctave')
setOctave('2', 'C#1') // => 'C#2'
```

Returns  a copy of the same note with the octave changed


## `note.transpose`

Transpose a note by an interval.

This is an alias of `tonal.transpose`

### Parameters

* `interval` **`String or Array`** the interval. If its false, the note is not transposed.
* `note` **`String or Array`** the note to transpose


### Examples

```js
var transpose = require('tonal.note/transpose')
transpose('3m', 'C4') // => 'Eb4'
transpose('C4', '3m') // => 'Eb4'
tranpose([1, 0, 2], [3, -1, 0]) // => [3, 0, 2]
['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
```

Returns  the note transposed


## `note.transpose`

Transpose a note by an interval.

This function is currified. The orider of the parameters is indiferent.

### Parameters

* `interval` **`String or Array`** the interval. If its false, the note is not transposed.
* `note` **`String or Array`** the note to transpose


### Examples

```js
var transpose = require('music.kit/note.transpose')
transpose('3m', 'C4') // => 'Eb4'
transpose('C4', '3m') // => 'Eb4'
tranpose([1, 0, 2], [3, -1, 0]) // => [3, 0, 2]
['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
```

Returns  the note transposed


## `pitch`

Get a pitch from a string. In tonal a pitch it's a note, an interval or a
pitch class. It allows us to work with this elements in an uniform way.

### Parameters

* `source` **`String`** the string


### Examples

```js
var pitch = require('music.pitch')
pitch('c2') // => 'C2'
pitch('2') // => '2M'
pitch('blah') // => null
```

Returns `String` the pitch or null if not a valid pitch


## `pitch.height`



### Parameters

* `pitch` **`String or Array`** the pitch to get the height from



Returns `Integer` the height of -1 if not valid note


## `pitch.operation`

Decorate a function to work with pitches in array notation






## `pitch.parse`

Convert a note or interval string to a [pitch in coord notation]()

### Parameters

* `pitch` **`String`** the note or interval to parse


### Examples

```js
pitch.parse('C2') // => [0, 2, null]
pitch.parse('5P') // => [1, 0]
```

Returns `Array` the pitch in array notation


## `pitch.simplify`

Simplifies a pitch. If its a note, it returns its pitch class. If its an
interval it returns the simplified interval

### Parameters

* `pitch` **`String or Array`** the pitch


### Examples

```js
var simplify = require('music.kit/pitch.simplify')
simplify('C#4') // => 'C#'
simplify('9m') // => '2m'
```

Returns  the simplified pitch


## `pitch.str`

Convert a pitch in coordinate notation to string. It deals with notes, pitch
classes and intervals.

### Parameters

* `pitch` **`Array`** the pitch in array notation


### Examples

```js
var pitch = require('music.pitch')
// pitch class
pitch.str([0]) // => 'C'
// interval
pitch.str([0, 0]) // => '1P'
// note
pitch.str([0, 2, 4]) // => 'C2/4'
```
```js
// require the funistron only
var str = require('music.pitch/str')
```

Returns `String` the pitch string


## `scale`

Get a scale by name using a dictionary.

You can get scale notes by passing a tonic or the scale intervals by passing
`false` as tonic

There is two ways to get a scale:

- With tonic included in name: `scale('C major')`
- With name and tonic: `scale('major', 'C')`

This function can be partially applied (see examples)

### Parameters

* `name` **`String`** the scale name (optionally can include the tonic)


### Examples

```js
var scale = require('music.scale')
// with name and tonic
scale('major', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// with tonic inside the name
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// partially applied
var major = scale('major')
major('C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

Returns `Object` a data object with the scale properties


## `scale.chord`

Get the (triad) chord name of a scale

### Parameters

* `scale` **`Array or String`** the scale notes


### Examples

```js
scale.chords('c d e f g a b') // => 'CM'
```

Returns `String` the chord name


## `scale.dictionary`

Scale dictionary



### Examples

```js
var scales = require('music.kit/scale/dictionary')
scales['major'] // => { name: 'major', intervals: ['1', '2', ...], aliases: [] }
```



## `scale.modes`

Get all modes of a scale

### Parameters

* `scale` **`Array`** the scale
* `all` **`Array`** the modes of the scale


### Examples

```js
var modes = require('music.kit/scale/modes')
modes('C D E') // => [ ['C', 'D', 'E'], ['D', 'E', 'C'], ['E', 'C', 'D'] ]
```



## `scale.names`

Given a list of notes get the scale names

### Parameters

* `notes` **`String or Array`** the scale notes


### Examples

```js
// get all known scale names
scale.names() // => ['major', 'minor', ... ] (89 names)
scale.names('D E F G A B C') [ 'D dorian' ]
scale.names('D E F G A B C') [ 'D dorian' ]
```

Returns `Array` an array of scale names or all known scale names if no arguments provided


## `scale.scale`

Create a scale from a gamut and a tonic. A scale is a set of notes or
intervals ordered by frequency with a tonic.

A source can be a list of intervals or notes.

The tonic can be a note (with or without octave), false to get the scale
intervals or null to set the first note of the source as tonic

This function is currified, so you can partially apply the function passing
one parameter instead of two (see example)

### Parameters

* `source` **`Array`** the list of intervals or notes
* `tonic` **`String`** the tonic of the scale


### Examples

```js
var scale = require('music.kit/scale/scale')
// basic usage
scale('1 2 3 5 6', 'G') // => ['G', 'A', 'B', 'D', 'E']
scale('1 2 3 5 6', false) // => ['1P', '2M', '3M', '5P', '6M']
```
```js
// uses first note of the source as tonic
scale('c d e f g a b c d e', null) // => []
```
```js
// partially applied
var dorian = scale('D E F G A B C')
dorian('C4') // => ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4']
```

Returns `Array` the list of notes


## `scale.select`

Select notes from a scale using degree numbers.

The resulting array will contain the notes in the same order as degrees.
If a given degree is not present in the scale, the result will contain a
null in that position.

This function is currified so it can be partially applied.

### Parameters

* `degrees` **`Array or String`** the degrees numbers list
* `scale` **`Array or String`** the scale notes


### Examples

```js
var select = require('music.kit/scale.select')
// basic usage:
select('1 3 5', 'C D E F G A B') // => [ 'C', 'E', 'G' ]
// order matters:
select('1 5 2 6', 'C D E F G A B') // => [ 'C', 'G', 'D', 'A' ]
// not found degrees are null:
select('1 2 6', 'C D E F G') // => [ 'C', 'D', null ]
// numbers bigger than 7 are transposed one octave or more:
select('1 8 15', 'C2 D2 E2') // => ['C2', 'C3', 'C4']
// partially applied:
var triad = select('1 3 5')
triad('C D E F G A B') // => ['C', 'E', 'G']
```

Returns `Array` the melodic pattern (or null if not present)


## `set`

Create a set: a set is a list of uniq pitch classes or simplified intervals
in ascending pitch order

This is an alias of `gamut.set`

### Parameters

* `notes` **`String or Array`** the note list


### Examples

```js
var set = require('music.set/set')
set('E7 C2 e D5 c1') // => ['C', 'D', 'E']
set('11 10 9') // => [ '2M', '3M', '4P' ]
```

Returns  the set


## `set.binary`

Get a set binary number

A set binary number is a 12 digit binary, each digit representing a step
in the chromatic scale. For example, `101010000000` is `['1P', '2M', '3M']`

The set binary number is very useful to check if two sets are equal or
contains same intervals (regarding of note names)

### Parameters

* `source` **`String or Array or Array<Array>`** a gamut


### Examples

```js
var binary = require('tonal.set/binary')
binary('C2 E4 D3') // => '101010000000'
```

Returns `String` the binary number


## `set.fromBinary`

Get a set from a binary set number and (optionally) a tonic. If the tonic is
a note, you get a pitch set. If its false you get a interval set.

### Parameters

* `source` **`String or Array or Array<Array>`** the gamut
* `tonic` **`String`** the first note of the set or false to get the intervals


### Examples

```js
var fromBinary = require('tonal.set/fromBinary')
// use a 12 digit binary number:
fromBinary('101011010101', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// or its decimal equivalent:
fromBinary(2773, 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// get the interval set by passing `false` as tonic:
fromBinary(2773, false) // => ['1P', '2M', '3M', '4', '5', '6M', '7M']
```

Returns  the set pitch classes (note names without octaves)


