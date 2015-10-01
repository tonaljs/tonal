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
- [distance](#pitchdistance) -  Get the distance in semitones between to pitches
- [enharmonic](#pitchenharmonic) -  Get the enharmonic of a pitch with a given step
- [enharmonics](#pitchenharmonics) -  Get all the enharmonics of a pitch (up to 4 alterations)
- [fromFreq](#pitchfromfreq) -  Get the pitch of a given frequency.
- [fromKey](#pitchfromkey) -  Get the pitch of the given piano key number
- [fromMidi](#pitchfrommidi) -  Get the pitch of the given midi number
- [harmonize](#pitchharmonize) -  Create a collection of pitches by transposing a tonic by a collection of intervals
- [interval](#pitchinterval) -  Get the interval between two pitches
- [intervalFrom](#pitchintervalfrom) -  Get a function that returns an interval from a pitch
- [intervalTo](#pitchintervalto) -  Get a function that returns a interval to a pitch
- [letter](#pitchletter) -  Get the letter of a pitch (and optionally move a number of steps)
- [octave](#pitchoctave) -  Get the octave of a pitch
- [pitchClass](#pitchpitchclass) -  Get the [pitchClass](https://en.wikipedia.org/wiki/Pitch_class) of a pitch
- [props](#pitchprops) -  Get pitch properties
- [sci](#pitchsci) -  Get the scientific representation of a given pitch (or null if its not a valid pitch).
- [toFreq](#pitchtofreq) -  Get the pitch frequency in hertzs
- [toKey](#pitchtokey) -  Get the key number from a pitch
- [toMidi](#pitchtomidi) -  Get the midi of a pitch
- [transpose](#pitchtranspose) -  Transpose a pitch by an interval



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
###### [pitch/harmonize](#pitch-module)



#### harmonize(tonic, intervals, pitchClassOnly) → {Array}



Create a collection of pitches by transposing a tonic by a collection of intervals

This is a shortcut to create and invoke an harmonizer

__Arguments:__

Name|Type|Description
---|---|---
`tonic`|String|the tonic
`intervals`|String,Array|a collection of intervals
`pitchClassOnly`|boolean|if true, the returned pitches don't include octave information


__Returns:__

Type|Description
---|---
Array|a collection of pitches


__Example:__

```js
harmonize('C2', ['P1 P5']) // => ['C2', 'G2']
```

Source: [pitch/harmonize.js](https://github.com/danigb/tonal/tree/master/lib/pitch/harmonize.js)
Test: [pitch/harmonizeTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/harmonizeTest.js)

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
###### [pitch/props](#pitch-module)



#### props(pitch) → {Object}



Get pitch properties

It returns an object with the following properties:

- __name__: the given pitch string
- __letter__: the pitch letter __always__ in uppercase
- __sci__: the pitch in scientific representation
- __pitchClass__: the pitch [pitch class](https://en.wikipedia.org/wiki/Pitch_class)
(letter in uppercase, accidentals using 'b' or '#', never 'x', no octave)
- __acc__: a string with the accidentals or '' if no accidentals (never null)
- __oct__: a integer with the octave. If not present in the pitch, is set to 4
- __alter__: the integer representic the accidentals (0 for no accidentals,
- __midi__: {Integer} the midi value
-1 for 'b', -2 for 'bb', 1 for '#', 2 for '##', etc...)
- __chroma__: {Integer} the pitch class interger value (between 0 and 11)
where C=0, C#=1, D=2...B=11

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to get the properties from


__Returns:__

Type|Description
---|---
Object|an object with the pitch components or null if its not a valid pitch


__Example:__

```js
props('C#2') // => { }
```

Source: [pitch/props.js](https://github.com/danigb/tonal/tree/master/lib/pitch/props.js)
Test: [pitch/propsTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/propsTest.js)

----
###### [pitch/sci](#pitch-module)



#### sci(pitch, alteration, octave) → {String}



Get the scientific representation of a given pitch (or null if its not a valid
pitch).

If not given, the octave is 4 by default. You can override the alteration
and/or octave with optionals parameters

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|a pitch, a pitch class or a pitch letter
`alteration`|String,Integer|(Optional) the alteration number (overrides the one from the pitch string). Can be null to avoid overrides
`octave`|Integer|(Optional) the octave (overrides the one from the pitch string)


__Returns:__

Type|Description
---|---
String|the pitch in scientific notation or null if not valid pitch


__Example:__

```js
sci('c') // => 'C4'
sci('c', '#') // => 'C#4'
sci('c', '#', 2) // => 'C#2'
sci('b#4') // => 'B#4'
sci('C#4', 'b', 2) // => 'Cb2'
sci('C#4', null, 2) // => 'C#2'
sci('C7', -1) // => 'Cb7'
sci('bluf') // => null
```

Source: [pitch/sci.js](https://github.com/danigb/tonal/tree/master/lib/pitch/sci.js)
Test: [pitch/sciTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/sciTest.js)

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



#### toMidi(pitch) → {Interger}



Get the midi of a pitch

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to get the midi number from


__Returns:__

Type|Description
---|---
Interger|the midi number or null if not a valid pitch


__Example:__

```js
toMidi('a4') // => 69
```

Source: [pitch/toMidi.js](https://github.com/danigb/tonal/tree/master/lib/pitch/toMidi.js)
Test: [pitch/toMidiTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/toMidiTest.js)

----
###### [pitch/transpose](#pitch-module)



#### transpose(pitch, interval) → {String}



Transpose a pitch by an interval

This is an _strict_ function: if pitch or interval are not valid, an exception
is thrown

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to be transposed
`interval`|String|(Optional) the interval. If not present, a partially applied function with the pitch is returned


__Returns:__

Type|Description
---|---
String|the resulting pitch


__Example:__

```js
transpose('E', 'M2') // => 'F#4'
transpose('C', 'M-2') // => 'Bb3'
['M2', 'm3', 'P-8'].map(tranapose('C')) // => ['D4', 'Eb4', 'C3']
['C', 'D', 'E'].map(transpose('M2')) // => ['D4', 'E4', 'F#4']
```

Source: [pitch/transpose.js](https://github.com/danigb/tonal/tree/master/lib/pitch/transpose.js)
Test: [pitch/transposeTest.js](https://github.com/danigb/tonal/tree/master/test/pitch/transposeTest.js)

