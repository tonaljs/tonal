# [tonal](https://github.com/danigb/tonal#readme) *0.1.0*

>Functional, modular music theory library



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




## midiNoteName(midi, pitchClass) 

Get the note name of the given midi number

Since there are several names, you can choose the pitch class of the enharmonics


### Parameters

- **midi** `Integer`   - the midi number
- **pitchClass** `String`   - desired pitch class. Must be uppercase




### Returns


- `Void`




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




## parseInterval(name) 

Parse a interval name and returns an object with interval properties

Valid intervals are: 'P5', 'm3', 'd-2', 'P-4', 'M13'...

The returned object has the following properties:
- name: the full name of the interval
- quality: the quality of the interval ('d', 'm', 'P', 'M' or 'A')
- number: the __simplified__ number of the interval (always between -9 and 9)
- oct: the number of octaves (can be negative)
- dist: the distance in semitiones (__whithout octaves__: a number between -12 and 12)

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

Parse a note name and returns an object with its properties

The note object has the following properties:
- `pc`: the [pitch class](https://en.wikipedia.org/wiki/Pitch_class). __Always
in uppercase__. One of 'A', 'B', 'C', 'D', 'E', 'F', 'G'
- `acc`: the accidentals. A string of 'b' or '#'. Double sharp is notated
with '##'. If the note has no accidentals, the value is an empty string.
- `oct`: the octave (as integer, can be negative). If no octave is present in
the string to be parsed, its 4 by default
- `name`: the name of the note (with uppercase pitch class, accidentals __and__ octave)


### Parameters

- **note** `String`   - the note string to be parsed




### Examples

```javascript
var parse = require('tonal/parse-note')
parse('c') // => { pc: 'C', acc: '', oct: 4, name: 'C4' }
parse('db2') // => { pc: 'D', acc: 'b', oct: 2, name: 'Db2' }
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




## transpose(interval, note, the) 

Transpose a note a given interval




### Parameters

- **interval** `String` `Interval`   - the interval to tranpose
- **note** `String` `Note`   - the note to be transposed
- **the** `String`   transposed note




### Examples

```javascript
var transpose = require('tonal/transpose')
transpose('M2', 'E') // => 'F#4'
```


### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
