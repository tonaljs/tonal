## `gamut`

A gamut is a collection of intervals, pitch classes or notes.
Scales, chords, pitch sets are examples of gamuts.

### Parameters

* `source` **`String or Array`** a list of elements


### Examples

```js
var gamut = require('music-gamut')
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


