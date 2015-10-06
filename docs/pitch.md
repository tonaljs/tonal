# Pitch module

This is the building block of tonal. Pitches are just strings in scientific notation. You can create it from midi numbers or frequencies (and reverse), query for its properties, transpose them or find interval distances. Almost everything you need from pitches is here.

### Working with midi and frequencies

You can use `pitch/fromMidi` and `pitch/toMidi` to midi-pitch conversion:

```js
var fromMidi = require('tonal/pitch/fromMidi')
fromMidi(69) // => 'A4'
var toMidi = require('tonal/pitch/toMidi')
toMidi('C') // => 60
```

The same works with `pitch/fromFreq` and `pitch/toFreq`.

Additionally the `pitch/cents` function allow to calculate the distance in cents between frequencies or pitches:

```js
var cents = require('tonal/pitch/cents')
c('A4', 446) // => 23.44
```

### Pitch properties

Use `pitch/props` to get the properties of a pitch:

```js
var props = require('tonal/pitch/props')
props('c#2').pitchClass // => 'C#'
```

Here is the properties list and examples:

| Prop name  | Description | c#2 | bbb | Bx6 |
|---|---|-----|-----|-----|
|name| The provided string |c#2 | bbb | Bx6 |
|sci| Scientific notation | C#2 | Bbb4 | B##6 |
|letter| Pitch letter | C | B | B |
|pitchClass| Pitch class | C# | Bbb | B## |
|chroma| Pitch class integer | 1 | 9 | 1 |
|acc| Accidentals | # | bb | ## |
|alter| Accidentals integer | 1 | -2 | 2 |
|oct| Octave | 2 | 4 | 6 |
|midi| Midi number | 37 | 69 | 97 |

### Transposition and distances

You can use `pitch/transpose` to transpose a pitch and `pitch/interval` to find the interval between two pitches:

```js
var transpose = require('tonal/pitch/transpose')
['C', 'D', 'E'].map(transpose('3M')) // => ['E', 'F#', 'G#']
```

### Resources

- Music Theory Book: http://2012books.lardbucket.org/books/music-theory/s07-the-elements-of-pitch-sound-sy.html

## Pitch function list

- [alterToAcc](#pitchaltertoacc) -  Get the accidentals from an alteration number
- [byFreq](#pitchbyfreq) -  Get a comparator function to sort pitches by frequency
- [cents](#pitchcents) -  Get the distance in cents between pitches or frequencies
- [chroma](#pitchchroma) -  Get chroma of a pitch. The chroma is the integer notation of a pitch class
- [distance](#pitchdistance) -  Get the distance in semitones between to pitches
- [enharmonic](#pitchenharmonic) -  Get the enharmonic of a pitch with a given step
- [enharmonics](#pitchenharmonics) -  Get all the enharmonics of a pitch (up to 4 alterations)
- [fromFifths](#pitchfromfifths) -  Get array pitch structure from a fifths coordinate structure
- [fromFreq](#pitchfromfreq) -  Get the pitch of a given frequency.
- [fromKey](#pitchfromkey) -  Get the pitch of the given piano key number
- [fromMidi](#pitchfrommidi) -  Get the pitch of the given midi number
- [harmonizer](#pitchharmonizer) -  Get an harmonizer for a list of intervals. An harmonizer is a function that _harmonizes_ a pitch: given a pitch returns a collection of pitches.
- [interval](#pitchinterval) -  Get the interval between two pitches
- [intervalFrom](#pitchintervalfrom) -  Get a function that returns an interval from a pitch
- [intervalStr](#pitchintervalstr) -  Get the interval string from a pitch array
- [intervalTo](#pitchintervalto) -  Get a function that returns a interval to a pitch
- [letter](#pitchletter) -  Get the letter of a pitch (and optionally move a number of steps)
- [octave](#pitchoctave) -  Get the octave of a pitch
- [parse](#pitchparse) -  Get ternary array pitch representation.
- [pitchClass](#pitchpitchclass) -  Get the [pitchClass](https://en.wikipedia.org/wiki/Pitch_class) of a pitch
- [pitchStr](#pitchpitchstr) -  Get a pitch (in scientific notation) from a ternary pitch array
- [toFifths](#pitchtofifths) -  Get the fifths vector representation of a pitch
- [toFreq](#pitchtofreq) -  Get the pitch frequency in hertzs
- [toKey](#pitchtokey) -  Get the key number from a pitch
- [toMidi](#pitchtomidi) -  Get the midi number of a pitch
- [transpose](#pitchtranspose) -  



## API

----
###### [pitch/alterToAcc](#pitch-module)



#### alterToAcc(alteration) → {String}



Get the accidentals from an alteration number

__Arguments:__

Name|Type|Description
---|---|---
`alteration`|Integer|the alteration number


__Returns:__

Type|Description
---|---
String|the accidentals string


__Example:__

```js
alterToAcc(1) // => '#'
alterToAcc(3) // => '###'
alterToAcc(0) // => ''
alterToAcc(-1) // => 'b'
alterToAcc(-2) // => 'bb'
```

Source: [pitch/alterToAcc.js](https://github.com/danigb/tonal/tree/master/lib/pitch/alterToAcc.js)
Test: [pitch/alterToAccTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/alterToAccTest.js)

----
###### [pitch/byFreq](#pitch-module)



#### byFreq(descending) → {Function}



Get a comparator function to sort pitches by frequency

__Arguments:__

Name|Type|Description
---|---|---
`descending`|boolean|(Optional) true to sort descending


__Returns:__

Type|Description
---|---
Function|a comparator function


__Example:__

```js
['G', 'E', 'A', 'D'].sort(byFreq()) // => ['D', 'E', 'G', 'A']
```

Source: [pitch/byFreq.js](https://github.com/danigb/tonal/tree/master/lib/pitch/byFreq.js)
Test: [pitch/byFreqTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/byFreqTest.js)

----
###### [pitch/cents](#pitch-module)



#### cents(from, to, decimals) → {Integer}



Get the distance in cents between pitches or frequencies

__Arguments:__

Name|Type|Description
---|---|---
`from`|String,Integer|first pitch or frequency
`to`|String,Integer|other pitch or frequency
`decimals`|Integer|the decimal precision (2 by default)


__Returns:__

Type|Description
---|---
Integer|the distance in cents


__Example:__

```js
cents(440, 444) // => 15.66
cents('A4', 444) // => 15.66
cents('A4', 'A#4') // => 100
```

Source: [pitch/cents.js](https://github.com/danigb/tonal/tree/master/lib/pitch/cents.js)
Test: [pitch/centsTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/centsTest.js)

----
###### [pitch/chroma](#pitch-module)



#### chroma(pitch) → {Integer}



Get chroma of a pitch. The chroma is the integer notation of a pitch class

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to get the chorma from


__Returns:__

Type|Description
---|---
Integer|the chroma


__Example:__

```js
chroma('C') // => 0
chroma('B#') // => 0
chroma('Dbb') // => 0
```

Source: [pitch/chroma.js](https://github.com/danigb/tonal/tree/master/lib/pitch/chroma.js)
Test: [pitch/chromaTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/chromaTest.js)

----
###### [pitch/distance](#pitch-module)



#### distance(from, to) → {Integer}



Get the distance in semitones between to pitches

__Arguments:__

Name|Type|Description
---|---|---
`from`|String|the first pitch
`to`|String|the destination pitch


__Returns:__

Type|Description
---|---
Integer|the number of semitones (can be negative)


__Example:__

```js
distance('C4', 'D5') // => 14
distance('A', 'G') // => -2
```

Source: [pitch/distance.js](https://github.com/danigb/tonal/tree/master/lib/pitch/distance.js)
Test: [pitch/distanceTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/distanceTest.js)

----
###### [pitch/enharmonic](#pitch-module)



#### enharmonic() → {String}



Get the enharmonic of a pitch with a given step

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---
String|the enharmonic pitch name


__Example:__

```js
enharmonic('C#4', 'D') // => 'Db4'
enharmonic('B#', 'C') // => 'C'
```

Source: [pitch/enharmonic.js](https://github.com/danigb/tonal/tree/master/lib/pitch/enharmonic.js)
Test: [pitch/enharmonicTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/enharmonicTest.js)

----
###### [pitch/enharmonics](#pitch-module)



#### enharmonics(pitch, includeSource) → {Array}



Get all the enharmonics of a pitch (up to 4 alterations)

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to get the enharmonics from
`includeSource`|boolean|(Optional) If true, the returned array will contain the given pitch. False by default


__Returns:__

Type|Description
---|---
Array|an array of pitches ordered by distance to the given one


__Example:__

```js
enharmonics('C') // => [ 'A###3', 'B#3', 'Dbb4', 'Ebbbb4' ]
enharmonics('Ab3') // => ['E####3', 'F###3', 'G#3', 'Bbbb3', 'Cbbbb4']
enharmonics('C', true) // => [ 'A###3', 'B#3', 'C4', 'Dbb4', 'Ebbbb4' ]
```

Source: [pitch/enharmonics.js](https://github.com/danigb/tonal/tree/master/lib/pitch/enharmonics.js)
Test: [pitch/enharmonicsTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/enharmonicsTest.js)

----
###### [pitch/fromFifths](#pitch-module)



#### fromFifths(coord) → {Array}



Get array pitch structure from a fifths coordinate structure

__Arguments:__

Name|Type|Description
---|---|---
`coord`|Array|the fifths coordinate


__Returns:__

Type|Description
---|---
Array|the ternary pitch structure


__Example:__

```js
fromFifths([3, -1]) // => [6, 0, 1]
```

Source: [pitch/fromFifths.js](https://github.com/danigb/tonal/tree/master/lib/pitch/fromFifths.js)
Test: [pitch/fromFifthsTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/fromFifthsTest.js)

----
###### [pitch/fromFreq](#pitch-module)



#### fromFreq(freq) → {String}



Get the pitch of a given frequency.

It will round the frequency to the nearest pitch frequency. Use `cents` function
if you need to know the difference between the the frequency and the pitch.

__Arguments:__

Name|Type|Description
---|---|---
`freq`|Float|the frequency


__Returns:__

Type|Description
---|---
String|the pitch


__Example:__

```js
fromFreq(440) // => 'A4'
fromFreq(443) // => 'A4'
cents(443, 'A4') // => ... to get the difference
```

Source: [pitch/fromFreq.js](https://github.com/danigb/tonal/tree/master/lib/pitch/fromFreq.js)
Test: [pitch/fromFreqTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/fromFreqTest.js)

----
###### [pitch/fromKey](#pitch-module)



#### fromKey(key) → {String}



Get the pitch of the given piano key number

This method doesn't take into account diatonic spelling. Always the same
pitch class is given to the same key number.

__Arguments:__

Name|Type|Description
---|---|---
`key`|Integer|the key number


__Returns:__

Type|Description
---|---
String|the pitch


__Example:__

```js
fromKey(40) // => 'C4'
fromKey(49) // => 'A4'
```

Source: [pitch/fromKey.js](https://github.com/danigb/tonal/tree/master/lib/pitch/fromKey.js)
Test: [pitch/fromKeyTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/fromKeyTest.js)

----
###### [pitch/fromMidi](#pitch-module)



#### fromMidi(midi) → {String}



Get the pitch of the given midi number

This method doesn't take into account diatonic spelling. Always the same
pitch class is given to the same midi number.

__Arguments:__

Name|Type|Description
---|---|---
`midi`|Integer|the midi number


__Returns:__

Type|Description
---|---
String|the pitch


__Example:__

```js
fromMidi(69) // => 'A4'
```

Source: [pitch/fromMidi.js](https://github.com/danigb/tonal/tree/master/lib/pitch/fromMidi.js)
Test: [pitch/fromMidiTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/fromMidiTest.js)

----
###### [pitch/harmonizer](#pitch-module)



#### harmonizer(intervals, pitchClassOnly) → {Function}



Get an harmonizer for a list of intervals. An harmonizer is a function that
_harmonizes_ a pitch: given a pitch returns a collection of pitches.

The harmonizer is a function with the signature `<String> => {Array}`, where
the string parameter is the pitch and the array is an array of pitches. If
no pitch is provided, it returns an array of intervals (see @example)

Harmonizer are the basic construction blocks of scales and chords.

__Arguments:__

Name|Type|Description
---|---|---
`intervals`|Array|the intervals array
`pitchClassOnly`|boolean|(Optional) if true, the harmonizer will return pitchClasses (no octaves) instead of full pitches


__Returns:__

Type|Description
---|---
Function|the harmonizer function


__Example:__

```js
var major = harmonizer(['1P', '3M', '5M'])
major('C') // => ['C4', 'E4', 'G4']
major('C', true) // => ['C', 'E', 'G'] (pitch classes only)
major() // => ['1P', '3M', '5M']
```

Source: [pitch/harmonizer.js](https://github.com/danigb/tonal/tree/master/lib/pitch/harmonizer.js)
Test: [pitch/harmonizerTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/harmonizerTest.js)

----
###### [pitch/interval](#pitch-module)



#### interval(from, to) → {String}



Get the interval between two pitches

You can get a partially applied version of this function by passing only one
parameter. See examples below:

__Arguments:__

Name|Type|Description
---|---|---
`from`|String|first pitch
`to`|String|second pitch


__Returns:__

Type|Description
---|---
String|the interval between pitches


__Example:__

```js
interval('C', 'D') // => 'M2'
['C', 'D', 'Eb'].map(interval.from('C')) // => ['P1', 'M2', 'm3']
```

Source: [pitch/interval.js](https://github.com/danigb/tonal/tree/master/lib/pitch/interval.js)
Test: [pitch/intervalTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/intervalTest.js)

----
###### [pitch/intervalFrom](#pitch-module)



#### intervalFrom(from) → {Function}



Get a function that returns an interval from a pitch

__Arguments:__

Name|Type|Description
---|---|---
`from`|String|the base pitch


__Returns:__

Type|Description
---|---
Function|a function that returns a interval from the base pitch to a given one


__Example:__

```js
['C', 'D', 'E'].map(intervalFrom('C')) // => ['1P', '2M', '3M']
```

Source: [pitch/intervalFrom.js](https://github.com/danigb/tonal/tree/master/lib/pitch/intervalFrom.js)
Test: [pitch/intervalFromTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/intervalFromTest.js)

----
###### [pitch/intervalStr](#pitch-module)



#### intervalStr(ternary) → {String}



Get the interval string from a pitch array

__Arguments:__

Name|Type|Description
---|---|---
`ternary`|Array|the pitch ternary array representation


__Returns:__

Type|Description
---|---
String|the pitch represented as an interval


__Example:__


Source: [pitch/intervalStr.js](https://github.com/danigb/tonal/tree/master/lib/pitch/intervalStr.js)
Test: [pitch/intervalStrTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/intervalStrTest.js)

----
###### [pitch/intervalTo](#pitch-module)



#### intervalTo(to) → {Function}



Get a function that returns a interval to a pitch

__Arguments:__

Name|Type|Description
---|---|---
`to`|String|the destination pitch


__Returns:__

Type|Description
---|---
Function|a function that returns a interval from a pitch to the destination one


__Example:__

```js
['C', 'D', 'E'].map(intervalTo('E')) // => ['3M', '2M', '1P']
```

Source: [pitch/intervalTo.js](https://github.com/danigb/tonal/tree/master/lib/pitch/intervalTo.js)
Test: [pitch/intervalToTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/intervalToTest.js)

----
###### [pitch/letter](#pitch-module)



#### letter(pitch, steps) → {String}



Get the letter of a pitch (and optionally move a number of steps)

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to get the letter from
`steps`|Integer|(Optional) the number of steps to move


__Returns:__

Type|Description
---|---
String|a pitch letter


__Example:__

```js
letter('c#5') // => 'C'
letter('c', 0) // => 'C'
letter('c', 1) // => 'D'
letter('c', 2) // => 'E'
```

Source: [pitch/letter.js](https://github.com/danigb/tonal/tree/master/lib/pitch/letter.js)
Test: [pitch/letterTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/letterTest.js)

----
###### [pitch/octave](#pitch-module)



#### octave(pitch) → {Interger}



Get the octave of a pitch

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to get the octave from


__Returns:__

Type|Description
---|---
Interger|the octave number or null if not a valid pitch


__Example:__

```js
octave('a4') // => 4
```

Source: [pitch/octave.js](https://github.com/danigb/tonal/tree/master/lib/pitch/octave.js)
Test: [pitch/octaveTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/octaveTest.js)

----
###### [pitch/parse](#pitch-module)



#### parse() → {Array}



Get ternary array pitch representation.

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---
Array|an array in the form [step, alt, oct]


__Example:__


Source: [pitch/parse.js](https://github.com/danigb/tonal/tree/master/lib/pitch/parse.js)
Test: [pitch/parseTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/parseTest.js)

----
###### [pitch/pitchClass](#pitch-module)



#### pitchClass(pitch) → {Interger}



Get the [pitchClass](https://en.wikipedia.org/wiki/Pitch_class) of a pitch

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to get the pitchClass number from


__Returns:__

Type|Description
---|---
Interger|the pitchClass number or null if not a valid pitch


__Example:__

```js
pitchClass('a4') // => 'A'
pitchClass('ab') // => 'Ab'
pitchClass('cx2') // => 'C##'
```

Source: [pitch/pitchClass.js](https://github.com/danigb/tonal/tree/master/lib/pitch/pitchClass.js)
Test: [pitch/pitchClassTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/pitchClassTest.js)

----
###### [pitch/pitchStr](#pitch-module)



#### pitchStr(pitch) → {String}



Get a pitch (in scientific notation) from a ternary pitch array

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|Array|pitch array ([letter, accientals, octave])


__Returns:__

Type|Description
---|---
String|the pitch in scientific notation


__Example:__

```js
toPitch([1, 0, 0]) // => 'C4'
toPitch([1, 1, 0]) // => 'C#4'
toPitch([1, 2, 1]) // => 'C##5'
toPitch([1, -1, -1]) // => 'Cb3'
toPitch([1, -1, -2]) // => 'Cb2'
toPitch([2, 0, -2]) // => 'D2'
```

Source: [pitch/pitchStr.js](https://github.com/danigb/tonal/tree/master/lib/pitch/pitchStr.js)
Test: [pitch/pitchStrTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/pitchStrTest.js)

----
###### [pitch/toFifths](#pitch-module)



#### toFifths(pitch) → {Array}



Get the fifths vector representation of a pitch

The fifths vector representation is an array of two values, the first
is the number of fifths (from C4) and the second is the number of octaves
up or down to reach the pitch

This representation is useful for calculating interval distances, transpositions
or keys

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String,Array|the pitch (can be a string or a pitch array)


__Returns:__

Type|Description
---|---
Array|a fifths vector representation of a pitch


__Example:__

```js
toFifths('C4') // => [0, 0]
toFifths('C3') // => [0, -1]
toFifths('G4') // => [1, 0]
```

Source: [pitch/toFifths.js](https://github.com/danigb/tonal/tree/master/lib/pitch/toFifths.js)
Test: [pitch/toFifthsTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/toFifthsTest.js)

----
###### [pitch/toFreq](#pitch-module)



#### toFreq(pitch, tuning) → {Float}



Get the pitch frequency in hertzs

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch
`tuning`|Integer|optional tuning, 440 by default


__Returns:__

Type|Description
---|---
Float|- the pitch frequency


__Example:__

```js
toFreq('A4') // => 440
toFreq('A3', 444) // => 222
```

Source: [pitch/toFreq.js](https://github.com/danigb/tonal/tree/master/lib/pitch/toFreq.js)
Test: [pitch/toFreqTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/toFreqTest.js)

----
###### [pitch/toKey](#pitch-module)



#### toKey(pitch) → {Integer}



Get the key number from a pitch

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch


__Returns:__

Type|Description
---|---
Integer|the key number


__Example:__

```js
toKey(49) // => 'A4'
```

Source: [pitch/toKey.js](https://github.com/danigb/tonal/tree/master/lib/pitch/toKey.js)
Test: [pitch/toKeyTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/toKeyTest.js)

----
###### [pitch/toMidi](#pitch-module)



#### toMidi(pitch, octave) → {Integer}



Get the midi number of a pitch

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch string
`octave`|Integer|(Optional) the pitch octave (will override the value from the pitch string)


__Returns:__

Type|Description
---|---
Integer|the midi number


__Example:__

```js
toMidi('A4') // => 69
toMidi('A4', 3) // => 57
```

Source: [pitch/toMidi.js](https://github.com/danigb/tonal/tree/master/lib/pitch/toMidi.js)
Test: [pitch/toMidiTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/toMidiTest.js)

----
###### [pitch/transpose](#pitch-module)



#### transpose() → {}





__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__


Source: [pitch/transpose.js](https://github.com/danigb/tonal/tree/master/lib/pitch/transpose.js)
Test: [pitch/transposeTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/transposeTest.js)

