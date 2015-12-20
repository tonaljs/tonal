## `binarySet.toBinary`

Get a set binary number from a collection of notes or intervals

A set binary number is a 12 digit binary, each digit representing a step
in the chromatic scale. For example, `101010000000` is `['1P', '2M', '3M']`

The set binary number is very useful to check if two sets are equal or
contains same intervals (regarding of note names)

### Parameters

* `source` **`String or Array or Array<Array>`** a gamut


### Examples

```js
var binarySet = require('binary-set')
binarySet.toBinary('C2 E4 D3') // => '101010000000'
```

Returns `String` the binary number


## `chord`

A chord dictionary. Get chord data from a chord name.

### Parameters

* `name` **`String`** the chord name


### Examples

```js
// get chord data
var chord = require('chord-dictionary')
chord('Maj7') // => { name: 'Maj7', aliases: ['M7', 'maj7']
               //      intervals:  [ ...],
               //      binary: '100010010001', decimal: 2193 }
```
```js
// get it from aliases, binary or decimal numbers
chord('Maj7') === chord('M7') === chord('100010010001') === chord(2913)
```
```js
// get chord names
chord.names // => ['Maj7', 'm7', ...]
```



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


## `dictionary`

Create a musical dictionary. A musical dictionary is a function that given
a name (and optionally a tonic) returns an array of notes.

A dictionary is created from a HashMap. It maps a name to a string with
an interval list and, optionally, an alternative name list (see example)

Additionally, the dictionary has properties (see examples):

- data: a hash with the dictionary data
- names: an array with all the names
- aliases: an array with all the names including aliases
- source: the source of the dictionary

Each value of the data hash have the following properties:

- name: the name
- aliases: an array with the alternative names
- intervals: an array with the intervals
- steps: an array with the intervals in __array notation__
- binary: a binary representation of the set
- decimal: the decimal representation of the set

### Parameters

* `source` **`Hash`** the dictionary source


### Examples

```js
var dictionary = require('music-dictionary')
var chords = dictionary({'Maj7': ['1 3 5 7', ['M7']], 'm7': ['1 3b 5 7b'] })
chords('CMaj7') // => ['C', 'E', 'G', 'B']
chords('DM7') // => ['D', 'F#', 'A', 'C#']
chords('Bm7') // => ['B', 'D', 'F#', 'A']
```
```js
// dictionary data
chords.data['M7'] // => { name: 'Maj7', aliases: ['M7'],
                  //      intervals: ['1', '3', '5', '7'], steps: [ ...],
                  //      binary: '10010010001', decimal: 2193 }

// get chord by binary numbers
chords.data['100010010001'] === chords.data['Maj7']
chords.data[2193] === chords.data['Maj7']
```
```js
// available names
chords.names // => ['Maj7', 'm7']
chords.aliases // => ['Maj7', 'm7', 'M7']
```

Returns `Function` the dictionary


## `enharmonics.simplify`

Try to get a simpler enharmonic note name

### Parameters

* `note` **`String`** the note to simplify


### Examples

```js
var enharmonics = require('enharmonics')
enharmonics.simplify('B#3') // => 'C4'
```

Returns `String` the simplfiied note (can be the same)


## `gamut`

A gamut is a collection of intervals, pitch classes or notes.
Scales, chords, pitch sets are examples of gamuts.

### Parameters

* `source` **`String or Array`** a list of elements
* `operation` **`String or Function`** the operation to perfom


### Examples

```js
var gamut = require('music-gamut')
gamut('c2 bb fx blah') // => ['C2', 'Bb', 'F##', null]
```

Returns `Array` a list of pitches


## `gamut.operation`

Decorate a function to work with gamuts.

The function to decorate receives an array of pitches in
[array notation]()  and should return the desired transformed array.

### Parameters

* `fn` **`Function`** the function to decorate



Returns `Function` the decorated function


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


## `gamut.select`

Select some elements from a gamut

### Parameters

* `numbers` **`String or Array`** a __1-based__ index of the elements
* `gamut` **`String or Array`** the notes or intervals


### Examples

```js
var gamut = require('tonal.gamut')
gamut.select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
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
var gamut = require('music-gamut')
gamut.sort('c5 d2 f4 D2') // => ['D2', 'D2', 'F4', 'C5']
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
var G = require('music-gamut')
G.split('a | B C , Dmaj7') // => ['a', 'B', 'C', 'Dmaj7']
G.split() // => []
```

Returns `Array` the source as array


## `harmonizer`

Create an harmonizer






## `key`

Create a key from a string. A key is a string with a tonic and a mode



### Examples

```js
var key = require('music-key')
key('C major') // => 'C major'
key('c Major') // => 'C major'
key('C') // => 'C major'
key('dbb miXolydian') // => 'Dbb mixolydian'
```



## `key.alteratons`

Get the number of alterations of a key

### Parameters

* `name` **`String`** the key name


### Examples

```js
var key = require('music-key')
key.alterations('C major') // => 0
key.alterations('F major') // => -1
key.alterations('Eb major') // => -3
key.alterations('A major') // => 3
key.alterations('nonsense') // => null
```

Returns `Integer` the number of alterations or null if not valid key


## `key.altered`

Get a list of altered notes in the appropriate order

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.altered('F major') // => ['Bb']
key.altered('Eb major') // => ['Bb', 'Eb', 'Ab']
key.altered('A major') // => ['F#', 'C#', 'G#']
```

Returns `Array` an array with the altered notes ordered or an empty array
if its not a valid key name


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


## `key.parse`

Parse a key name

### Parameters

* `name` **`String`** the key name


### Examples

```js
var key = require('music-key')
key.parse('C major') // => ['C', 'major']
key.parse('fx MINOR') // => ['F##', 'minor']
key.parse('Ab mixolydian') // => ['Ab', 'mixolydian']
key.parse('f bebop') // => 'null'
```

Returns `Array` an array with the tonic and mode or null if not valid key


## `key.progression`

Get a chord progression from within a key

### Parameters

* `numerals` **`String or Array`** the roman numerals
* `key` **`String`** the key name





## `key.relative`

Get relative of a key

This function is currified, so it can be partially applied (see examples)

### Parameters

* `relative` **`String`** the name of the relative mode desired
* `key` **`String`** the key name


### Examples

```js
var key = require('music-key')
key.relative('minor', 'C major') // => 'A minor'
key.relative('major', 'A minor') // => 'C major'
key.relative('dorian', 'F major') // => 'G dorian'

// partially application
var minorOf = key.relative('minor')
minorOf('Bb major') // => 'G minor'
```

Returns `String` the relative key name or null if the key or the relative name
are not valid


## `key.scale`

Get the scale of a key



### Examples

```js
var key = require('music-key')
key.scale('C major') // => ['C', 'D', 'E', ...]
```



## `key.signature`

Get signature of a key

### Parameters

* `name` **`String`** the key name


### Examples

```js
var key = require('music-key')
key.signature('F major') // => 'b'
key.signature('Eb major') // => 'bbb'
key.signature('A major') // => '###'
key.signature('C major') // => ''
key.signature('nonsense') // => null
```

Returns `String` a string with the alterations


## `midi`

Get the midi number of a note

If the argument passed to this function is a valid midi number, it returns it

The note can be an string in scientific notation or
[array pitch notation](https://github.com/danigb/music.array.notation)

### Parameters

* `note` **`String or Array or Integer`** the note in string or array notation. If the parameter is a valid midi number it return it as it.


### Examples

```js
var midi = require('note-midi')
midi('A4') // => 69
midi('a3') // => 57
midi([0, 2]) // => 36 (C2 in array notation)
midi(60) // => 60
```

Returns `Integer` the midi number


## `midi.freq`

Get the pitch frequency in herzs (with custom concert tuning) from a midi number

This function is currified so it can be partially applied (see examples)

### Parameters

* `tuning` **`Float`** the frequency of A4 (null means 440)
* `midi` **`Integer`** the midi number


### Examples

```js
var freq = require('midi-freq')
// 69 midi is A4
freq(null, 69) // => 440
freq(444, 69) // => 444
```
```js
// partially applied
var freq = require('midi-freq')(440)
freq(69) // => 440
```

Returns `Float` the frequency of the note


## `midi.note`

Get the note name (in scientific notation) of the given midi number

It uses MIDI's [Tuning Standard](https://en.wikipedia.org/wiki/MIDI_Tuning_Standard)
where A4 is 69

This method doesn't take into account diatonic spelling. Always the same
pitch class is given for the same midi number.

### Parameters

* `midi` **`Integer`** the midi number


### Examples

```js
var note = require('midi-note')
note(69) // => 'A4'
```

Returns `String` the pitch


## `note.enharmonics`

Get the enharmonics of a note. It returns an array of three elements: the
below enharmonic, the note, and the upper enharmonic

### Parameters

* `note` **`String`** the note to get the enharmonics from


### Examples

```js
enharmonics = require('enharmonics')
enharmonics('C') // => ['B#', 'C', 'Dbb']
enharmonics('A') // => ['G##', 'A', 'Bbb']
enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
```

Returns `Array` an array of pitches ordered by distance to the given one


## `note.fromMidi`

Convert from midi to note number
An alias for `midi.note`






## `note.interval`

Get the interval between two pitches

If one or both are pitch classes, a simple ascending interval is returned

This function can be partially applied (see examples)

### Parameters

* `from` **`String`** the first note
* `to` **`String`** the second note


### Examples

```js
var interval = require('note-interval')
interval('C2', 'D3') // => '9M'
interval('D2', 'C2') // => '-2M'
interval('D', 'C') // => '7m'
```
```js
// partially applied
var fromC = interval('C')
fromC('D') // => '2M'
```

Returns `String` the interval between them


## `note.midi`

Convert from note name to midi number
An alias for `midi`






## `note.transpose`

Transpose a note by an interval.

This function is currified. The order of the parameters is indifferent.

### Parameters

* `interval` **`String or Array`** the interval. If its false, the note is not transposed.
* `note` **`String or Array`** the note to transpose


### Examples

```js
var transpose = require('note-transpose')
transpose('3m', 'C4') // => 'Eb4'
transpose('C4', '3m') // => 'Eb4'
tranpose([1, 0, 2], [3, -1, 0]) // => [3, 0, 2]
['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
```

Returns  the note transposed


## `operation`

Decorate a function to work with intervals, notes or pitches in
[array notation](https://github.com/danigb/tonal/tree/next/packages/array-notation)
with independence of string representations.

This is the base of the pluggable notation system of
[tonal](https://github.com/danigb/tonal)

### Parameters

* `parse` **`Function`** the parser
* `str` **`Function`** the string builder
* `fn` **`Function`** the operation to decorate


### Examples

```js
var parse = require('array-notation/interval/parse')
var str = require('array-notation/interval/str')
var operation = require('array-notation/operation')(parse, str)
var add = operation(function(a, b) { return [a[0] + b[0], a[1] + b[1]] })
add('3m', '3M') // => '5P'
```



## `pitchSet`

Create a pitch set from a gamut and (optional) a tonic. A pitch set is a
collection of uniq notes or intervals sorted by frequency

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
var set = require('pitch-set')

// uses first note of the source as tonic
set('d2 c4 e3 f g6 a B c d5 e', null) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']

// create scales
set('1 2 3 5 6', 'G') // => ['G', 'A', 'B', 'D', 'E']
set('1 2 3 5 6', false) // => ['1P', '2M', '3M', '5P', '6M']

// partially applied
var dorian = set('D E F G A B C')
dorian('C4') // => ['C4', 'D4', 'Eb4', 'F4', 'G4', 'A4', 'Bb4']
```

Returns `Array` the list of notes


## `scale`

A scale dictionary. Get scale from a scale name and a tonic.

The dictionary has a `names` property with all scale names.

### Parameters

* `name` **`String`** the scale name


### Examples

```js
// get scale data
var scale = require('scale-dictionary')
scale('Ab major') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]
scale('major', 'Ab') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]
// get scale intervals
scale('major', false) // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
```
```js
// get it from aliases, binary or decimal numbers
scale('major') === scale('ionian') === scale('101011010101') === scale(2773)
```
```js
// get scale names
scale.names // => ['major', 'dorian', ...]
```



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


## `transpose`

Transpose notes
An alias for `note.transpose`






