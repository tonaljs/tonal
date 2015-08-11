# [tonal](https://github.com/danigb/tonal#readme) *0.1.0*

>Functional, modular music theory library



## cycleOfFifths(value) 

Get the relation between a note and the number of steps in the cycle of fifths




### Parameters

- **value** `Integer` `String`   - if a integer is given, return the note name moving value steps in the cycle. If a note name is given, it returns the number
of steps




### Examples

```javascript
var cycle = require('tonal/cycle-of-fifths')
cycle(0) // => 'C'
cycle(1) // => 'G'
cycle(-1) // => 'F'
cycle('C') // => 0
cycle('G') // => 1
cycle('F') // => -1
```


### Returns


- `String` `Integer`   - the note name or the number of steps (depending of the param)




## cycle(root, interval, length, offset) 

Create cycles of notes by transposing them by an interval.




### Parameters

- **root** `String` `Note`   - the first note of the cycle (required)
- **interval** `String` `Interval`   - the interval used to transpose the note (required)
- **length** `Integer`   - the length of the returned array (required, must be > 0)
- **offset** `Integer`   - if specified, the first note of the cycle will be the root after _offset_ steps. Optional, 0 by default




### Examples

```javascript
var cycle = require('tonal/cycle')
cycle('C', 'P5', 4) // ['C', 'G', 'D', 'A']
cycle('C', 'P5', 4', 2) // ['D', 'A', 'E', 'B']
```


### Returns


- `Array`   an array of notes __without__ octave




## distance(noteA, noteB) 

Get the interval name of the distsance between two notes




### Parameters

- **noteA** `Note` `String`   - source note
- **noteB** `Note` `String`   - destination note




### Examples

```javascript
   var distance = require('tonal/distance')
   distance('C3', 'G3') // => 'P5'
```


### Returns


- `String`   - the interval name




## enharmonics(note, pitchClass) 

Get a list of note names with the same pitch as the given one




### Parameters

- **note** `Note` `String`   - the note to find enharmonics of
- **pitchClass** `String`   - if given, limit the list to notes with this pitch class. Must be uppercase




### Examples

```javascript
var enharmonics = require('tonal/enharmonics')
enharmonics('C4') // => ['B#3', 'Dbb4']
enharmonics('C4', 'B') // => ['B#3']
```


### Returns


- `Array`   - an array of note names




## freq(note, tuning) 

Get the note frequency in hertzs




### Parameters

- **note** `String` `Note`   - the note
- **tuning** `Integer`   - optional tuning, 440 by default




### Examples

```javascript
var freq = require('tonal/freq')
freq('A4') // => 440
freq('A3', 444) // => 222
```


### Returns


- `Float`   - the note frequency




## intervalClass(interval) 

Get the [interval class](https://en.wikipedia.org/wiki/Interval_class) of
a given interval.

In musical set theory, an interval class  is the shortest distance in
pitch class space between two unordered pitch classes


### Parameters

- **interval** `String` `Interval`   - the Interval




### Examples

```javascript
var intervalClass = require('tonal/interval-class')
intervalClass('P8') // => 0
intervalClass('m6') // => 4
```


### Returns


- `Integer`   A value between 0 and 6




## intervalNames(distance) 

Get a list of intervals names filtered by the size in semitones




### Parameters

- **distance** `Integer`   - distance of the intervals in semitones




### Examples

```javascript
var intervalNames = require('tonal/interval-names')
intervalNames(7) // => ['P5', 'd6']
```


### Returns


- `Array`   - a list of interval names




## intervalNumber(pitchClassA, pitchClassB, descending) 

Calculate the interval number (diatonic number)
between two pitch classes.

The interval number is the number of notes with _different_ letter names that
can be contained within two notes.


### Parameters

- **pitchClassA** `String`   - the pitch class of the first note. Must be uppercase
- **pitchClassB** `String`   - the pitch class of the second note. Must be uppercase
- **descending** `boolean`   - if the interval is descending. It is false by default




### Examples

```javascript
var intervalNumber = require('tonal/diatonic-number')
intervalNumber('C', 'E'); // => 3
```


### Returns


- `Integer`   - the diatonic number




## invertInterval(interval) 

Get the inverted interval of the given one




### Parameters

- **interval** `String` `Interval`   - the interval to be inverted




### Examples

```javascript
var invert = require('tonal/invert')
invert('M3') // => 'm6'
```


### Returns


- `String`   the inverted Interval




## isScaleBinaryNumber(binary) 

Determine if a given binary string represents a valid scale

A valid binary number is a 12 digit binary number with a 1 in the first position


### Parameters

- **binary** `String`   - the binary number




### Returns


- `boolean`   true if its a valid scale binary number




## keySignature(signature) 

Given a key signature, get key signature information

The key signature can be expressed in several ways:
- with number: 2 means 'two sharps', -2 means 'two flats'
- with accidentals: '##' or 'bb'
- with major tonic: for example, 'C'

The key signature object has the following properties:
- num: the key signature number
- acc: the key signature accidentals
- major: the note name of the major tonality associated to this key signature
- minor: the note name of the minor tonality associated to this key signature


### Parameters

- **signature** `Integer` `String`   - the key signature expressen in number, accidentals, or major tonic




### Returns


- `Object`   an object with the key signature information




## midi(note) 

Get the midi number of the given note




### Parameters

- **note** `Note` `String`   - the note




### Examples

```javascript
var midi = require('tonal/midi')
midi('A4') // => 69
```


### Returns


- `Integer`   - the midi number




## noteFromMidi(midi, pitchClass) 

Get the note of the given midi number

Since there are several names for each number, optionally you can choose
the pitch class of the enharmonics


### Parameters

- **midi** `Integer`   - the midi number
- **pitchClass** `String`   - desired pitch class. (Optional, must be uppercase)




### Returns


- `String`   the note or null if there's no pitchClass available to this note name




## noteName(note) 

Get the note name of a note represented in [scientific notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)

The note name is the [pitch class](https://en.wikipedia.org/wiki/Pitch_class)
of the note (__always__ in uppercase) with the alterations (the octave is ignored)

If the note given is not a valid note, an exception is thrown


### Parameters

- **note** `String`   - the note to get the name of




### Returns


- `String`   the note name




## parseInterval(name) 

Parse a interval name and returns an object with interval properties

Valid intervals are: 'P5', 'm3', 'd-2', 'P-4', 'M13'...

The returned object has the following properties:
- `name`: the full name of the interval
- `quality`: the quality of the interval ('d', 'm', 'P', 'M' or 'A')
- `num`: the __simplified__ number of the interval (always between -9 and 9)
- `oct`: the number of octaves (can be negative)
- `dist`: the distance in semitiones (__whithout octaves__: a number between -12 and 12)

If the string is not a interval ('g3') or its a invalid interval ('M5') an
exception is thrown.


### Parameters

- **name** `String`   - the name of the interval to be parsed




### Examples

```javascript
var parse = require('tonal/parse-interval')
parse('P-5') // => { name: 'P-5', num: -5, oct: 0, dist: -7 }
parse('M9') // => { name: 'M9', num: 2, oct: 1, dist: 2 }
```


### Returns


- `Object`   the interval object




## parseNote(note) 

Parse a note string in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation)

The octave in the note string is optional, and this parse method returns an
object with the following properties:
- `pc`: the [pitch class](https://en.wikipedia.org/wiki/Pitch_class). __Always
in uppercase__. One of 'A', 'B', 'C', 'D', 'E', 'F', 'G'
- `acc`: the accidentals. A string of 'b' or '#'. Double sharp is notated
with '##'. If the note has no accidentals, the value is an empty string (never null).
- `oct`: the octave (as integer, can be negative). If no octave is present in
the string to be parsed, it is set to 4.

If the string is not a valid note, an exception is thrown


### Parameters

- **note** `String`   - the note string to be parsed




### Examples

```javascript
var parse = require('tonal/parse-note')
parse('db2') // => { pc: 'D', acc: 'b', oct: 2 }
parse('b#3') // => { pc: 'B', acc: '#', oct: 3 }
parse('c') // => { pc: 'C', acc: '', oct: 4 }
```


### Returns


- `Object`   the note object




## pitchClass(note, steps) 

Return the pitch class of a note modified by a number of steps




### Parameters

- **note** `String` `Note`   - the note to get the pitch class or a pitch class letter. If a note is given the accidentals and octave are ignored
- **steps** `Integer`   - the number of steps to be raised or lowel the pitch class




### Examples

```javascript
var pitchClass = require('tonal/pitch-class')
pitchClass('C', 3) // => 'E'
pitchClass('D', -2) // => 'B'
pitchClass('db4', 2) // => 'F'
```


### Returns


- `String`   a uppercase letter with the pitch class




## transpose(interval, note) 

Transpose a note a given interval




### Parameters

- **interval** `String` `Interval`   - the interval to tranpose
- **note** `String` `Note`   - the note to be transposed




### Examples

```javascript
var transpose = require('tonal/transpose')
transpose('M2', 'E') // => 'F#4'
```


### Returns


- `String`   the transposed note




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
