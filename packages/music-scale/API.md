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


