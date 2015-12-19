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


## `chord.names`

Given a list of notes get the chord names

### Parameters

* `notes` **`String or Array`** the chord notes


### Examples

```js
var chord = require('music.chord')
chord.names() // => ['Maj7', 'm7', ... ] (109 names)
chord.names(true) // => [ ]
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


## `exports`

Get chord dictionary data






