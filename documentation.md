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

Get the names of the intervals with the given distance in semitones




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




## parse() 








### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
