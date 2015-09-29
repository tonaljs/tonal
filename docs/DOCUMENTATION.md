# Tonal functions

Tonal is a collection of js functions to work with tonal elements of music.

Tonal functions are grouped by modules.



__Modules summary__

- __[Pitch](#pitch-module)__ -  [alterToAcc](#pitchaltertoacc), [byFreq](#pitchbyfreq), [cents](#pitchcents), [distance](#pitchdistance), [enharmonic](#pitchenharmonic), [enharmonics](#pitchenharmonics), [fromFreq](#pitchfromfreq), [fromKey](#pitchfromkey), [fromMidi](#pitchfrommidi), [harmonizer](#pitchharmonizer), [interval](#pitchinterval), [intervalFrom](#pitchintervalfrom), [intervalTo](#pitchintervalto), [letter](#pitchletter), [octave](#pitchoctave), [pitchClass](#pitchpitchclass), [props](#pitchprops), [sci](#pitchsci), [toFreq](#pitchtofreq), [toKey](#pitchtokey), [toMidi](#pitchtomidi), [transpose](#pitchtranspose)
- __[Interval](#interval-module)__ -  [add](#intervaladd), [build](#intervalbuild), [invert](#intervalinvert), [isInterval](#intervalisinterval), [opposite](#intervalopposite), [props](#intervalprops), [semitones](#intervalsemitones), [simplify](#intervalsimplify)
- __[Collection](#collection-module)__ -  [dictionary](#collectiondictionary), [harmonize](#collectionharmonize), [intervals](#collectionintervals), [mode](#collectionmode), [modes](#collectionmodes), [pitchSet](#collectionpitchset), [rotate](#collectionrotate), [toArray](#collectiontoarray), [triad](#collectiontriad)
- __[Scale](#scale-module)__ -  [find](#scalefind), [intervals](#scaleintervals), [names](#scalenames), [scale](#scalescale)
- __[Chord](#chord-module)__ -  [chord](#chordchord), [extensions](#chordextensions), [find](#chordfind), [intervals](#chordintervals), [names](#chordnames), [scaleNames](#chordscalenames), [voicings](#chordvoicings)
- __[BinaryScale](#binaryscale-module)__ -  [filter](#binaryscalefilter), [fromCollection](#binaryscalefromcollection), [fromNumber](#binaryscalefromnumber), [intervals](#binaryscaleintervals), [isValid](#binaryscaleisvalid), [modes](#binaryscalemodes), [props](#binaryscaleprops)
- __[Key](#key-module)__ -  [accidentals](#keyaccidentals), [alteredNotes](#keyalterednotes), [fromPitchSet](#keyfrompitchset), [keyNumber](#keykeynumber), [parse](#keyparse), [pitchSet](#keypitchset), [triads](#keytriads)
- __[Fifths](#fifths-module)__ -  [byFifths](#fifthsbyfifths), [distance](#fifthsdistance), [distanceFrom](#fifthsdistancefrom), [transpose](#fifthstranspose)



## Pitch module



[Back to top](#tonal-functions)




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

### Function list

- [alterToAcc](#pitchaltertoacc) -  Get the accidentals from an alteration number
- [byFreq](#pitchbyfreq) -  Get a comparator function to sort pitches by frequency
- [cents](#pitchcents) -  Get the distance in cents between pitches or frequencies
- [distance](#pitchdistance) -  Get the distance in semitones between to pitches
- [enharmonic](#pitchenharmonic) -  Get the enharmonic of a pitch with a given step
- [enharmonics](#pitchenharmonics) -  Get all the enharmonics of a pitch (up to 4 alterations)
- [fromFreq](#pitchfromfreq) -  Get the pitch of a given frequency.
- [fromKey](#pitchfromkey) -  Get the pitch of the given piano key number
- [fromMidi](#pitchfrommidi) -  Get the pitch of the given midi number
- [harmonizer](#pitchharmonizer) -  Get an harmonizer for a list of intervals. An harmonizer is a function that _harmonizes_ a pitch: given a pitch returns a collection of pitches.
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



### API

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
###### [pitch/harmonizer](#pitch-module)



#### harmonizer() → {}



Get an harmonizer for a list of intervals. An harmonizer is a function that
_harmonizes_ a pitch: given a pitch returns a collection of pitches.

The returned function receives two parameters:
- {String} pitch - the pitch to be harmonized
- {boolean} pitchClassesOnly - set true to get only pitch classes

Harmonizer are the basic construction blocks of scales and chords.

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


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


## Interval module



[Back to top](#tonal-functions)




Create and manipulate intervals. An interval in tonal is a string in the form: `(direction)?(number)(quality)` where direction is `'-'` or empty string, number is a positive decimal number and quality is one of `dd`, `d`, `m`, `M`, `A` or `AA`. `'1P'` and `-9m` are valid intervals.

You can get the interval properties with `interval/props` and manipulate in the standard ways: add two intervals, simplify intervals, get opposite...

### Function list

- [add](#intervaladd) -  Add two intervals
- [build](#intervalbuild) -  Build an interval (string) given a number, and optionally a quality and octave.
- [invert](#intervalinvert) -  Get the [inversion](https://en.wikipedia.org/wiki/Interval_(music)#Inversion) of an interval.
- [isInterval](#intervalisinterval) -  Test if a string is a valid interval
- [opposite](#intervalopposite) -  Get the opposite of an interval
- [props](#intervalprops) -  Get interval properties
- [semitones](#intervalsemitones) -  Get the semitones of a interval
- [simplify](#intervalsimplify) -  Simplify an interval



### API

----
###### [interval/add](#interval-module)



#### add(interval1, interval2) → {String}



Add two intervals

__Arguments:__

Name|Type|Description
---|---|---
`interval1`|String|the first interval
`interval2`|String|the second interval


__Returns:__

Type|Description
---|---
String|the resulting interval


__Example:__

```js
add('M2', 'M2') // => 'M3'
```

Source: [interval/add.js](https://github.com/danigb/tonal/tree/master/lib/interval/add.js)
Test: [interval/addTest.js](https://github.com/danigb/tonal/tree/master/test/interval/addTest.js)

----
###### [interval/build](#interval-module)



#### build(number, quality|alteration, oct) → {}



Build an interval (string) given a number, and optionally a quality
and octave.

It can be used to check if a interval is a valid interval:
`build('5M') // => null`

The first parameter can be another interval, but in this case the quality
and octave parameters will have precedence over the interval.

__Arguments:__

Name|Type|Description
---|---|---
`number`|String,Integer|the interval number (can be negative to express descengin intervals) or another interval
`quality|alteration`|String,Integer|(Optional) the interval quality or numberic alteration (0 is perfect or major). Can be null to avoid override the string
`oct`|Integer|(Optional) the octaves. If negative, the direction of the interval is descendent. 0 by default.


__Returns:__

Type|Description
---|---


__Example:__

```js
build(2) // => '2M'
build(2, 'm') // => '2m'
build(2, 'a', 1) // => '9A'
build(2, 'a', -1) // => '-9A'
build(2, null, 1) // => '9M'
build(-2, 'm', 1) // => '-9m'
build(-2, -1, 1) // => '-9m'
build(2, 'AA') // => '2AA'
build(2, 'AAA') // => null
build('2P') // => null
```

Source: [interval/build.js](https://github.com/danigb/tonal/tree/master/lib/interval/build.js)
Test: [interval/buildTest.js](https://github.com/danigb/tonal/tree/master/test/interval/buildTest.js)

----
###### [interval/invert](#interval-module)



#### invert(interval, ascending) → {}



Get the [inversion](https://en.wikipedia.org/wiki/Interval_(music)#Inversion)
of an interval.

Notice that all inverted intervals are simple.

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String|the interval to invert
`ascending`|Boolean|(Optional) if true, the inverted interval will be ascending, if false (by default) the direction will be the same as the
given interval


__Returns:__

Type|Description
---|---


__Example:__

```js
invert('M9') // => 'M2'
invert('M-10') // => 'M-3'
invert('P-11', true) // => 'P4'
```

Source: [interval/invert.js](https://github.com/danigb/tonal/tree/master/lib/interval/invert.js)
Test: [interval/invertTest.js](https://github.com/danigb/tonal/tree/master/test/interval/invertTest.js)

----
###### [interval/isInterval](#interval-module)



#### isInterval(interval) → {Boolean}



Test if a string is a valid interval

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String|the interval to be tested


__Returns:__

Type|Description
---|---
Boolean|true if its a valid interval


__Example:__

```js
isInterval('blah') // false
isInterval('P5') // true
isInterval('P6') // false
```

Source: [interval/isInterval.js](https://github.com/danigb/tonal/tree/master/lib/interval/isInterval.js)
Test: [interval/isIntervalTest.js](https://github.com/danigb/tonal/tree/master/test/interval/isIntervalTest.js)

----
###### [interval/opposite](#interval-module)



#### opposite() → {}



Get the opposite of an interval

An opposite interval is the same interval with the opposite direction

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
opposite('M2') // => 'M-2'
opposite('P-8') // => 'P8'
```

Source: [interval/opposite.js](https://github.com/danigb/tonal/tree/master/lib/interval/opposite.js)
Test: [interval/oppositeTest.js](https://github.com/danigb/tonal/tree/master/test/interval/oppositeTest.js)

----
###### [interval/props](#interval-module)



#### props(name) → {Array}



Get interval properties

This method retuns an object with the following properties:
- name: the interval name
- quality: the quality (one of `dmPMA` for dimished, minor, perfect, major and
augmented respectively)
- num: diatonic number (a positive integer bigger that 0)
- alter: an integer with the alteration respect to 'P' or 'M' (depending on the type)
- dir: direction, 1 for ascending intervals, -1 for descending ones
- oct: the number of octaves (a positive integer)
- type: the interval type. 'P' for 'perfect', 'M' for major. This is not the
quality of the interval, just if it is perfectable or not.
- semitones: the size of the interval in semitones

__Arguments:__

Name|Type|Description
---|---|---
`name`|String|the name of the interval to be propsd


__Returns:__

Type|Description
---|---
Array|a interval object or null if not a valid interval


__Example:__

```js
var props = require('tonal/interval/props')
props('-5P') // => { name: '-5P', quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
props('9m') // => { name: '9m', quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }
```

Source: [interval/props.js](https://github.com/danigb/tonal/tree/master/lib/interval/props.js)
Test: [interval/propsTest.js](https://github.com/danigb/tonal/tree/master/test/interval/propsTest.js)

----
###### [interval/semitones](#interval-module)



#### semitones(interval) → {Interger}



Get the semitones of a interval

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String|the interval to get the semitones number from


__Returns:__

Type|Description
---|---
Interger|the semitones or null if not a valid interval


__Example:__

```js
semitones('5P') // => 7
```

Source: [interval/semitones.js](https://github.com/danigb/tonal/tree/master/lib/interval/semitones.js)
Test: [interval/semitonesTest.js](https://github.com/danigb/tonal/tree/master/test/interval/semitonesTest.js)

----
###### [interval/simplify](#interval-module)



#### simplify(interval, ascending) → {}



Simplify an interval

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String|the interval to be simplified
`ascending`|boolean|(optional) if true, the simplified interval will be always ascending


__Returns:__

Type|Description
---|---


__Example:__

```js
simplify('9M') // => '2M'
simplify('-9M') // => '-2M'
simplify('-2M', true) // => '2M'
```

Source: [interval/simplify.js](https://github.com/danigb/tonal/tree/master/lib/interval/simplify.js)
Test: [interval/simplifyTest.js](https://github.com/danigb/tonal/tree/master/test/interval/simplifyTest.js)


## Collection module



[Back to top](#tonal-functions)




Functions to work with a collection of pitches or intervals.

### Resources

Dive into the world of pitch class sets:

- http://www.mta.ca/pc-set/pc-set_new/pages/introduction/toc.html
- http://composertools.com/Theory/PCSets/

### Function list

- [dictionary](#collectiondictionary) -  Create a dictionary, a function that given a name, returns an array of intervals.
- [harmonize](#collectionharmonize) -  Create a collection of pitches by transposing a tonic by a collection of intervals
- [intervals](#collectionintervals) -  Get the intervals of a collection of pitches starting from a tonic
- [mode](#collectionmode) -  Get the mode of a collection of pitches.
- [modes](#collectionmodes) -  Return all modes of a collection of notes
- [pitchSet](#collectionpitchset) -  Create a set of pitch classes (ordered by frequency) from a collection
- [rotate](#collectionrotate) -  Rotate a collection
- [toArray](#collectiontoarray) -  Return an array (collection) of anything. If the source is an array, return it unaltered. If its an string, split it and anything else is wrapped to an array.
- [triad](#collectiontriad) -  Get a triad from a collection of notes, a simplistic implementation.



### API

----
###### [collection/dictionary](#collection-module)



#### dictionary(data, aliases) → {Function}



Create a dictionary, a function that given a name, returns an array of intervals.

Passing a function as a parameter to the dictionary, it returns a list of all
available names filtered by that function

The dictionary (function) has the following signature:
`fn({String|Function}) -> {Array<Intervals>}` (see examples)

__Arguments:__

Name|Type|Description
---|---|---
`data`|HashMap|the hashmap data
`aliases`|HashMap|(Optional) the aliases hashmap


__Returns:__

Type|Description
---|---
Function|a dictionary


__Example:__

```js
chords = dictionary({'Maj7': '1P 3M 5P 7M'}, {'M7': 'Maj7'})
chords('Maj7') // => ['1P', '3M', '5P', '7M']
chords('M7') // => ['1P', '3M', '5P', '7M']

// get all major chord names (no aliases):
chords(function(c) { return c[1] === '3M' }) // => ['Maj7']
```

Source: [collection/dictionary.js](https://github.com/danigb/tonal/tree/master/lib/collection/dictionary.js)
Test: [collection/dictionaryTest.js](https://github.com/danigb/tonal/tree/master/test/collection/dictionaryTest.js)

----
###### [collection/harmonize](#collection-module)



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

Source: [collection/harmonize.js](https://github.com/danigb/tonal/tree/master/lib/collection/harmonize.js)
Test: [collection/harmonizeTest.js](https://github.com/danigb/tonal/tree/master/test/collection/harmonizeTest.js)

----
###### [collection/intervals](#collection-module)



#### intervals(pitches) → {Array}



Get the intervals of a collection of pitches starting from a tonic

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|Array|the pitch collection


__Returns:__

Type|Description
---|---
Array|the intervals 
TODO: better implementation, tests


__Example:__

```js
intervals(['C', 'D', 'Eb']) // => ['1P', '2M', '3m']
intervals('Bb', ['C', 'D', 'Eb']) // => ['2M', '3M', '4P']
```

Source: [collection/intervals.js](https://github.com/danigb/tonal/tree/master/lib/collection/intervals.js)
Test: [collection/intervalsTest.js](https://github.com/danigb/tonal/tree/master/test/collection/intervalsTest.js)

----
###### [collection/mode](#collection-module)



#### mode(name, num) → {Array}



Get the mode of a collection of pitches.

__Arguments:__

Name|Type|Description
---|---|---
`name`|String|the scale name
`num`|Integer|the mode number (1-based index)


__Returns:__

Type|Description
---|---
Array|the set of the mode


__Example:__

```js
mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
```

Source: [collection/mode.js](https://github.com/danigb/tonal/tree/master/lib/collection/mode.js)
Test: [collection/modeTest.js](https://github.com/danigb/tonal/tree/master/test/collection/modeTest.js)

----
###### [collection/modes](#collection-module)



#### modes(pitchSet) → {Array}



Return all modes of a collection of notes

__Arguments:__

Name|Type|Description
---|---|---
`pitchSet`|Array,String|the pitch set


__Returns:__

Type|Description
---|---
Array|an array of arrays with the set rotated set.length times


__Example:__

```js
modes('C D E') // => [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]]
```

Source: [collection/modes.js](https://github.com/danigb/tonal/tree/master/lib/collection/modes.js)
Test: [collection/modesTest.js](https://github.com/danigb/tonal/tree/master/test/collection/modesTest.js)

----
###### [collection/pitchSet](#collection-module)



#### pitchSet(pitches, first) → {Array}



Create a set of pitch classes (ordered by frequency) from a collection

The pitch classes are ordered by frequency starting from the first note
of the given collection

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|Array,String|the collection of pitches
`first`|String|(Optional) the first pitch class of the set (or the first pitch class of the collection if not given)


__Returns:__

Type|Description
---|---
Array|a pitch set


__Example:__

```js
pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']
pitchSet('D3 Db3 C3 D3', 'C') // => ['C', 'Db', 'Db', 'C']
```

Source: [collection/pitchSet.js](https://github.com/danigb/tonal/tree/master/lib/collection/pitchSet.js)
Test: [collection/pitchSetTest.js](https://github.com/danigb/tonal/tree/master/test/collection/pitchSetTest.js)

----
###### [collection/rotate](#collection-module)



#### rotate(times, array) → {Array}



Rotate a collection

__Arguments:__

Name|Type|Description
---|---|---
`times`|Integer|
`array`|String,Array|the source (se toArray)


__Returns:__

Type|Description
---|---
Array|the rotated array


__Example:__

```js
rotate(1, 'A B C') // => ['B', 'C', 'A']
```

Source: [collection/rotate.js](https://github.com/danigb/tonal/tree/master/lib/collection/rotate.js)
Test: [collection/rotateTest.js](https://github.com/danigb/tonal/tree/master/test/collection/rotateTest.js)

----
###### [collection/toArray](#collection-module)



#### toArray(source) → {Array}



Return an array (collection) of anything. If the source is an array, return it
unaltered. If its an string, split it and anything else is wrapped to an array.

__Arguments:__

Name|Type|Description
---|---|---
`source`|Array,String,Object|the source


__Returns:__

Type|Description
---|---
Array|an array


__Example:__

```js
// a toArray is an array of events
toArray(['A', 'B', 'C']) // => ['A', 'B', 'C']
toArray('A B C') // => ['A', 'B', 'C']
toArray('A | b | C') // => ['A', 'B', 'C']
toArray('A , b , C') // => ['A', 'B', 'C']
toArray(2) // => [ 2 ]
```

Source: [collection/toArray.js](https://github.com/danigb/tonal/tree/master/lib/collection/toArray.js)
Test: [collection/toArrayTest.js](https://github.com/danigb/tonal/tree/master/test/collection/toArrayTest.js)

----
###### [collection/triad](#collection-module)



#### triad(set, len) → {}



Get a triad from a collection of notes, a simplistic implementation.

__Arguments:__

Name|Type|Description
---|---|---
`set`|String,Array|the pitch class set
`len`|Integer|the number of notes of the triad (3 by default)


__Returns:__

Type|Description
---|---


__Example:__

```js
triad(scale('C major')) // => ['C', 'E', 'G']
triad(scale('C major'), 5) // => ['C', 'E', 'G', 'B', 'D']
```

Source: [collection/triad.js](https://github.com/danigb/tonal/tree/master/lib/collection/triad.js)
Test: [collection/triadTest.js](https://github.com/danigb/tonal/tree/master/test/collection/triadTest.js)


## Scale module



[Back to top](#tonal-functions)




A scale is a set of consecutive pitch classes.

Tonal provides a big dictionary of scales (108 at this moment) mapped to its names. The main function of this module is `scale/scale` to obtain scale notes or intervals:

```js
var scale = require('tonal/scale/scale')
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('dorian') // => ['1P', '2M', '3m', '4P', '5P', '6M', '7M']
```

### Function list

- [find](#scalefind) -  Get the scale name(s) of a collection of pitches
- [intervals](#scaleintervals) -  Get the intervals of a scale name (without tonic). Is uses a json dictionary.
- [names](#scalenames) -  Get all known scale names
- [scale](#scalescale) -  Get the scale (a set of intervals or pitch classes) with a given name and optionally a tonic



### API

----
###### [scale/find](#scale-module)



#### find(pitches) → {String}



Get the scale name(s) of a collection of pitches

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|Array,String|the pitches collection


__Returns:__

Type|Description
---|---
String|the scale name or null if not found


__Example:__

```js
 find('C D E F G A B') // => 'C major'
```

Source: [scale/find.js](https://github.com/danigb/tonal/tree/master/lib/scale/find.js)
Test: [scale/findTest.js](https://github.com/danigb/tonal/tree/master/test/scale/findTest.js)

----
###### [scale/intervals](#scale-module)



#### intervals(name) → {Array}



Get the intervals of a scale name (without tonic). Is uses a json dictionary.

__Arguments:__

Name|Type|Description
---|---|---
`name`|String|the scale name (without tonic)


__Returns:__

Type|Description
---|---
Array|the intervals or null if not found


__Example:__

```js
intervals('major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
```

Source: [scale/intervals.js](https://github.com/danigb/tonal/tree/master/lib/scale/intervals.js)
Test: [scale/intervalsTest.js](https://github.com/danigb/tonal/tree/master/test/scale/intervalsTest.js)

----
###### [scale/names](#scale-module)



#### names() → {Array}



Get all known scale names

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---
Array|array with all the known names


__Example:__

```js
names() => ['major', 'minor', ....]
```

Source: [scale/names.js](https://github.com/danigb/tonal/tree/master/lib/scale/names.js)
Test: [scale/namesTest.js](https://github.com/danigb/tonal/tree/master/test/scale/namesTest.js)

----
###### [scale/scale](#scale-module)



#### scale(tonic, name) → {Array}



Get the scale (a set of intervals or pitch classes) with a given name and
optionally a tonic

If the scale name does not contains the tonic, a list of intervals is returned

__Arguments:__

Name|Type|Description
---|---|---
`tonic`|String|(Optional) the tonic
`name`|String|the scale name


__Returns:__

Type|Description
---|---
Array|an array of intervals or notes (if tonic is present)


__Example:__

```js
scale('C', 'major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('D', 'diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']
```

Source: [scale/scale.js](https://github.com/danigb/tonal/tree/master/lib/scale/scale.js)
Test: [scale/scaleTest.js](https://github.com/danigb/tonal/tree/master/test/scale/scaleTest.js)


## Chord module



[Back to top](#tonal-functions)


# Chord module

Create chords by name and detect a chord by its pitches.

It uses a big .json dataset to get the chord intervals from the name.

### Function list

- [chord](#chordchord) -  Get a chord from a chord name. The chord is an array of pitches or intervals depending if a tonic is given or not.
- [extensions](#chordextensions) -  Given a chord type, get its extensions (same chord with more notes)
- [find](#chordfind) -  Get the chord name(s) of a collection of pitches
- [intervals](#chordintervals) -  Get the intervals of a chord name (without tonic). It uses a json dictionary
- [names](#chordnames) -  Get all known chord names
- [scaleNames](#chordscalenames) -  Given a chord type return its scale names
- [voicings](#chordvoicings) -  Get a voice (array of intervals) or a list of voicings for a given chord type



### API

----
###### [chord/chord](#chord-module)



#### chord(tonic, name) → {Array}



Get a chord from a chord name. The chord is an array of pitches or intervals
depending if a tonic is given or not.

__Arguments:__

Name|Type|Description
---|---|---
`tonic`|String|(Optional) the tonic pitch
`name`|String|the chord name (may include the tonic)


__Returns:__

Type|Description
---|---
Array|an array of intervals or notes (if the tonic is provided)


__Example:__

```js
chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
chord('C', 'Maj7') // => ['C4', 'E4', 'G4', 'B4']
chord('7b5') // => ['1P', '3M', '5d', '7m']
chord(null, '7b5') // => ['1P', '3M', '5d', '7m']
```

Source: [chord/chord.js](https://github.com/danigb/tonal/tree/master/lib/chord/chord.js)
Test: [chord/chordTest.js](https://github.com/danigb/tonal/tree/master/test/chord/chordTest.js)

----
###### [chord/extensions](#chord-module)



#### extensions(type) → {Array}



Given a chord type, get its extensions (same chord with more notes)

__Arguments:__

Name|Type|Description
---|---|---
`type`|String|the chord type


__Returns:__

Type|Description
---|---
Array|an array with all the chord types that extends the given ones


__Example:__

```js
extensions('Maj7') // => ['M13', 'M13#11', 'M7#11', ...]
```

Source: [chord/extensions.js](https://github.com/danigb/tonal/tree/master/lib/chord/extensions.js)
Test: [chord/extensionsTest.js](https://github.com/danigb/tonal/tree/master/test/chord/extensionsTest.js)

----
###### [chord/find](#chord-module)



#### find(pitches) → {Array}



Get the chord name(s) of a collection of pitches

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|String,Array|the pitch collection


__Returns:__

Type|Description
---|---
Array|an array of the chord names that has that pitches


__Example:__

```js
find('G2 E3 C4') // => ['CM/G', 'Em#5/G']
```

Source: [chord/find.js](https://github.com/danigb/tonal/tree/master/lib/chord/find.js)
Test: [chord/findTest.js](https://github.com/danigb/tonal/tree/master/test/chord/findTest.js)

----
###### [chord/intervals](#chord-module)



#### intervals(name) → {Array}



Get the intervals of a chord name (without tonic). It uses a json dictionary

__Arguments:__

Name|Type|Description
---|---|---
`name`|String|the chord name


__Returns:__

Type|Description
---|---
Array|the intervals or null if not found


__Example:__

```js
intervals('maj7') // => ['1P', '3M', '5P', '7M']
```

Source: [chord/intervals.js](https://github.com/danigb/tonal/tree/master/lib/chord/intervals.js)
Test: [chord/intervalsTest.js](https://github.com/danigb/tonal/tree/master/test/chord/intervalsTest.js)

----
###### [chord/names](#chord-module)



#### names() → {Array}



Get all known chord names

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---
Array|array with all the known names


__Example:__

```js
names() => ['major', 'minor', ....]
```

Source: [chord/names.js](https://github.com/danigb/tonal/tree/master/lib/chord/names.js)
Test: [chord/namesTest.js](https://github.com/danigb/tonal/tree/master/test/chord/namesTest.js)

----
###### [chord/scaleNames](#chord-module)



#### scaleNames(tonic, chord) → {Array}



Given a chord type return its scale names

__Arguments:__

Name|Type|Description
---|---|---
`tonic`|String|(Optional) the chord tonic
`chord`|String|the chord name


__Returns:__

Type|Description
---|---
Array|an array of scale names or an empty array if no scale names found


__Example:__

```js
scaleNames('D', 'M7b5') // => ['D4 lydian', 'Ab4 locrian pentatonic' ]
scaleNames('DM7b5') // => ['D4 lydian', 'Ab4 locrian pentatonic']
scaleNames('M7b5') // => ['P1 lydian', '5d locrian pentatonic']
scaleNames('Bbmaj7') // => ['Bb4 major', 'Bb4 lydian', 'F5 major pentatonic', 'D5 bebop minor', ...]
```

Source: [chord/scaleNames.js](https://github.com/danigb/tonal/tree/master/lib/chord/scaleNames.js)
Test: [chord/scaleNamesTest.js](https://github.com/danigb/tonal/tree/master/test/chord/scaleNamesTest.js)

----
###### [chord/voicings](#chord-module)



#### voicings(chordType, voiceName) → {Array}



Get a voice (array of intervals) or a list of voicings for a given chord type

__Arguments:__

Name|Type|Description
---|---|---
`chordType`|String|the type of the chord
`voiceName`|String|(Optional) the voice name


__Returns:__

Type|Description
---|---
Array|an array of intervals (if voiceName is provided and it's a valid voice) or an array of strings with voice names (if voiceName is not given)


__Example:__

```js
voicings('Maj7') // => ['left-hand-A', 'left-hand-B',..]
voicings('Maj7', 'left-hand-A') // => ['3M', '5P', '7M']
```

Source: [chord/voicings.js](https://github.com/danigb/tonal/tree/master/lib/chord/voicings.js)
Test: [chord/voicingsTest.js](https://github.com/danigb/tonal/tree/master/test/chord/voicingsTest.js)


## BinaryScale module



[Back to top](#tonal-functions)




A binary scale is a 12 digit binary number where the first number is a `1`, and it's used to represent scales (or, in fact, any pitch class set). It's a handy representation to compare scales (and see if they are different spellings of the same scale, for example) or get scale properties like the biggest distance between scale degrees:

```js
var binaryScale = require('tonal/binaryScale')
// compare two scales
binaryScale.fromCollection('C D E G') === binaryScale.fromCollection('C D Fb Abb') // true
// get the biggest distance between scale degrees
binaryScale.props(binaryScale.fromCollection('C D E F G A B')).leap // => 2
```

The first time I've read about it was in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanation is extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

> The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### Filter scales

The first valid binary scale is `'100000000000'` (2048) and the last one is
`'111111111111'` (4095) so the total number of binary scales is 2048.

The way to get them all is with the function [`binary-scale/filter`](#binaryscalefilter).

If we define valid scales like [this](http://2012books.lardbucket.org/books/music-theory/s08-01-scales-and-scale-steps.html):

> five or more pitches arranged in sequential patterns of whole steps and half steps

we can get the all the valid scales binary numbers like this:

```js
binaryScale.filter(function (binary) {
  var props = binaryScale.props(binary)
  return props.length > 4 && props.leap < 2
}
```

### Function list

- [filter](#binaryscalefilter) -  Get all binary scale numbers filtered by a function
- [fromCollection](#binaryscalefromcollection) -  Get the binary set number of a collection of pitches or intervals
- [fromNumber](#binaryscalefromnumber) -  Get a binary scale (a 12 digit binary number) from a number.
- [intervals](#binaryscaleintervals) -  Get a intervals collection from a binary scale number
- [isValid](#binaryscaleisvalid) -  Check if a number is a valid binary scale
- [modes](#binaryscalemodes) -  Get the all the modes of a binary scale.
- [props](#binaryscaleprops) -  Get the properties of a binary scale.



### API

----
###### [binaryScale/filter](#binaryscale-module)



#### filter(filter) → {Array}



Get all binary scale numbers filtered by a function

__Arguments:__

Name|Type|Description
---|---|---
`filter`|Function|(Optional) a filter function


__Returns:__

Type|Description
---|---
Array|an array of binary numbers. 2048 if no filter


__Example:__

```js
binarySets() // => ['1000000000', '1000000001', ...]
```

Source: [binaryScale/filter.js](https://github.com/danigb/tonal/tree/master/lib/binaryScale/filter.js)
Test: [binaryScale/filterTest.js](https://github.com/danigb/tonal/tree/master/test/binaryScale/filterTest.js)

----
###### [binaryScale/fromCollection](#binaryscale-module)



#### fromCollection(collection) → {String}



Get the binary set number of a collection of pitches or intervals

__Arguments:__

Name|Type|Description
---|---|---
`collection`|Array,String|a collection of pitches or intervals


__Returns:__

Type|Description
---|---
String|a binary number


__Example:__

```js
toBinary('C D') // => '101000000000'
toBinary('C4 D8') // => '101000000000'
toBinary('1P 2M') // => '101000000000'
toBinary('1P 9M') // => '101000000000'
toBinary('1P 7M') // => '100000000001'
```

Source: [binaryScale/fromCollection.js](https://github.com/danigb/tonal/tree/master/lib/binaryScale/fromCollection.js)
Test: [binaryScale/fromCollectionTest.js](https://github.com/danigb/tonal/tree/master/test/binaryScale/fromCollectionTest.js)

----
###### [binaryScale/fromNumber](#binaryscale-module)



#### fromNumber(number) → {String}



Get a binary scale (a 12 digit binary number) from a number.

__Arguments:__

Name|Type|Description
---|---|---
`number`|String,Integer|the binary scale number


__Returns:__

Type|Description
---|---
String|a binary scale (12 digit binary number)


__Example:__

```js
fromNumber(0) // => '10000000000'
fromNumber(2773) // => '101011010101' (major scale)
```

Source: [binaryScale/fromNumber.js](https://github.com/danigb/tonal/tree/master/lib/binaryScale/fromNumber.js)
Test: [binaryScale/fromNumberTest.js](https://github.com/danigb/tonal/tree/master/test/binaryScale/fromNumberTest.js)

----
###### [binaryScale/intervals](#binaryscale-module)



#### intervals(binary) → {Array}



Get a intervals collection from a binary scale number

__Arguments:__

Name|Type|Description
---|---|---
`binary`|String|a binary scale number


__Returns:__

Type|Description
---|---
Array|An array of intervals


__Example:__

```js
intervals('1P 2M') // => ['1P', '2M']
intervals(2773) // => ['1P', '2M', '3M']
```

Source: [binaryScale/intervals.js](https://github.com/danigb/tonal/tree/master/lib/binaryScale/intervals.js)
Test: [binaryScale/intervalsTest.js](https://github.com/danigb/tonal/tree/master/test/binaryScale/intervalsTest.js)

----
###### [binaryScale/isValid](#binaryscale-module)



#### isValid() → {}



Check if a number is a valid binary scale

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__


Source: [binaryScale/isValid.js](https://github.com/danigb/tonal/tree/master/lib/binaryScale/isValid.js)
Test: [binaryScale/isValidTest.js](https://github.com/danigb/tonal/tree/master/test/binaryScale/isValidTest.js)

----
###### [binaryScale/modes](#binaryscale-module)



#### modes(binary) → {Array}



Get the all the modes of a binary scale.

The modes are always ordered by number of steps so the first mode will be
always the cannonical mode (the mode that has the greatest possible number
of its larger steps at the beginning)

__Arguments:__

Name|Type|Description
---|---|---
`binary`|String|the binary number


__Returns:__

Type|Description
---|---
Array|an array of binary scales ordered by steps length


__Example:__

```js
// Exactly same result for two modes
modes('101011010101') // => [ '101010110101', '101011010101', '101011010110', ...]
modes('101010110101') // => [ '101010110101', '101011010101', '101011010110', ...]
```

Source: [binaryScale/modes.js](https://github.com/danigb/tonal/tree/master/lib/binaryScale/modes.js)
Test: [binaryScale/modesTest.js](https://github.com/danigb/tonal/tree/master/test/binaryScale/modesTest.js)

----
###### [binaryScale/props](#binaryscale-module)



#### props(binary) → {Array}



Get the properties of a binary scale.

The returned object has the following attributes:
- binary: a binary scale number
- decimal: decimal equivalent to the binary representation
- length: the number of notes of this scale
- steps: an array with the distance in semitones between the notes of the scale
- leap: the maximum distance between notes of the scale

__Arguments:__

Name|Type|Description
---|---|---
`binary`|String|the binary scale number


__Returns:__

Type|Description
---|---
Array|an array with the distances


__Example:__

```js
props('101011010101').decimal // => 2773 (major scale)
props('101011010101').length // => 7
props('101011010101').distances // => [ 2, 2, 1, 2, 2, 2, 1 ]
props('101011010101').leap // => 7
```

Source: [binaryScale/props.js](https://github.com/danigb/tonal/tree/master/lib/binaryScale/props.js)
Test: [binaryScale/propsTest.js](https://github.com/danigb/tonal/tree/master/test/binaryScale/propsTest.js)


## Key module



[Back to top](#tonal-functions)




At this moment, this module is a work in progress. 

### Function list

- [accidentals](#keyaccidentals) -  Given a key (number) returns the accidentals
- [alteredNotes](#keyalterednotes) -  Given a key, return the altered pitches
- [fromPitchSet](#keyfrompitchset) -  Given a pitch set, return its key
- [keyNumber](#keykeynumber) -  Get the key number (the number of sharps or flats) of a key
- [parse](#keyparse) -  Get the components of a key name
- [pitchSet](#keypitchset) -  Get the pitch class set from a key.
- [triads](#keytriads) -  Get the triads of



### API

----
###### [key/accidentals](#key-module)



#### accidentals() → {}



Given a key (number) returns the accidentals

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
accidentals('G major') // => '#'
accidentals('Eb minor') // => 'bbbbbb'
accidentals(3) // => '###'
accidentals(-2) // => 'bb'
```

Source: [key/accidentals.js](https://github.com/danigb/tonal/tree/master/lib/key/accidentals.js)
Test: [key/accidentalsTest.js](https://github.com/danigb/tonal/tree/master/test/key/accidentalsTest.js)

----
###### [key/alteredNotes](#key-module)



#### alteredNotes() → {}



Given a key, return the altered pitches

TODO: implementation

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
alteredNotes('D major') // => ['F#', 'C#']
alteredNotes(3) // => ['F#', 'C#', 'G#']
alteredNotes('bb') // => ['Bb', 'Eb']
```

Source: [key/alteredNotes.js](https://github.com/danigb/tonal/tree/master/lib/key/alteredNotes.js)
Test: [key/alteredNotesTest.js](https://github.com/danigb/tonal/tree/master/test/key/alteredNotesTest.js)

----
###### [key/fromPitchSet](#key-module)



#### fromPitchSet() → {}



Given a pitch set, return its key

TODO: implementation

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
fromPitchSet('C Bb F') // => -1
```

Source: [key/fromPitchSet.js](https://github.com/danigb/tonal/tree/master/lib/key/fromPitchSet.js)
Test: [key/fromPitchSetTest.js](https://github.com/danigb/tonal/tree/master/test/key/fromPitchSetTest.js)

----
###### [key/keyNumber](#key-module)



#### keyNumber(key) → {Integer}



Get the key number (the number of sharps or flats) of a key

The name can be a pitch class (and major key is supposed), a pitch class with
a 'major' or 'minor' appended, or a string with the accidentals

__Arguments:__

Name|Type|Description
---|---|---
`key`|String|the key (name, pitch or accidentals)


__Returns:__

Type|Description
---|---
Integer|the key number (alteration number)


__Example:__

```js
keyNumber('G major') // => 1
keyNumber('F major') // => -1
keyNumber('C') // => 0
keyNumber('Eb minor') // => -6
keyNumber('##') // => 2
keyNumber('bbb') // => -3
```

Source: [key/keyNumber.js](https://github.com/danigb/tonal/tree/master/lib/key/keyNumber.js)
Test: [key/keyNumberTest.js](https://github.com/danigb/tonal/tree/master/test/key/keyNumberTest.js)

----
###### [key/parse](#key-module)



#### parse() → {}



Get the components of a key name

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
parse('C minor') // => { tonic: 'C', type: 'minor'}
parse('C#') // => { tonic: 'C#', type: 'major'}
```

Source: [key/parse.js](https://github.com/danigb/tonal/tree/master/lib/key/parse.js)
Test: [key/parseTest.js](https://github.com/danigb/tonal/tree/master/test/key/parseTest.js)

----
###### [key/pitchSet](#key-module)



#### pitchSet(key) → {Array}



Get the pitch class set from a key.

__Arguments:__

Name|Type|Description
---|---|---
`key`|String|the key name


__Returns:__

Type|Description
---|---
Array|a pitch class set


__Example:__

```js
pitchSet('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
pitchSet('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
```

Source: [key/pitchSet.js](https://github.com/danigb/tonal/tree/master/lib/key/pitchSet.js)
Test: [key/pitchSetTest.js](https://github.com/danigb/tonal/tree/master/test/key/pitchSetTest.js)

----
###### [key/triads](#key-module)



#### triads(key) → {Array}



Get the triads of

__Arguments:__

Name|Type|Description
---|---|---
`key`|String|the key name


__Returns:__

Type|Description
---|---
Array|a pitch class set


__Example:__

```js
triads('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
triads('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
```

Source: [key/triads.js](https://github.com/danigb/tonal/tree/master/lib/key/triads.js)
Test: [key/triadsTest.js](https://github.com/danigb/tonal/tree/master/test/key/triadsTest.js)


## Fifths module



[Back to top](#tonal-functions)




Fifths plays an important role in western music. This module contains functions to work with line and cycle of fiths, calculate distance in fifths, transpose by fifths and order pitches by fifths distances.

```js
var distance = require('tonal/fifths/distance')
distance('F', 'C') // => -1
```

### Resources

- The line of fifths by David Temperley: http://www.theory.esm.rochester.edu/temperley/papers/temperley-ma00.pdf

### Function list

- [byFifths](#fifthsbyfifths) -  Get a comparator function to sort a collection of pitch classes by distance distance in fifths to a base (or C4)
- [distance](#fifthsdistance) -  Get the distance in fifths between two pitch classes
- [distanceFrom](#fifthsdistancefrom) -  Create a function to get distance in fifths from a given note.
- [transpose](#fifthstranspose) -  Transpose a pitch class by a number of fifths



### API

----
###### [fifths/byFifths](#fifths-module)



#### byFifths(from) → {Function}



Get a comparator function to sort a collection of pitch classes by
distance distance in fifths to a base (or C4)

__Arguments:__

Name|Type|Description
---|---|---
`from`|String|(Optional) the base pitch


__Returns:__

Type|Description
---|---
Function|a comparator function


__Example:__

```js
['C#', 'G#', 'F#'].sort(byFifths()) // => ['F#', 'C#', 'D#']
```

Source: [fifths/byFifths.js](https://github.com/danigb/tonal/tree/master/lib/fifths/byFifths.js)
Test: [fifths/byFifthsTest.js](https://github.com/danigb/tonal/tree/master/test/fifths/byFifthsTest.js)

----
###### [fifths/distance](#fifths-module)



#### distance(pitch, from) → {Integer}



Get the distance in fifths between two pitch classes

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to get the distance distance to
`from`|String|(Optional) the pitch to get the distance from (C if not specified)


__Returns:__

Type|Description
---|---
Integer|the number of fifths (can be negative)


__Example:__

```js
distance('C') // => 0
distance('G') // => 1
distance('D') // => 2
distance('F') // => -1
distance('Bb') // => -2
distance('A', 'D') // => 1
distance('C4', 'C2') // => 0
```

Source: [fifths/distance.js](https://github.com/danigb/tonal/tree/master/lib/fifths/distance.js)
Test: [fifths/distanceTest.js](https://github.com/danigb/tonal/tree/master/test/fifths/distanceTest.js)

----
###### [fifths/distanceFrom](#fifths-module)



#### distanceFrom(from) → {function}



Create a function to get distance in fifths from a given note.

__Arguments:__

Name|Type|Description
---|---|---
`from`|String|the from note of the distance distance


__Returns:__

Type|Description
---|---
function|the functtion to calculate distances


__Example:__

```js
['A', 'B', 'C'].map(distanceFrom('G'))
```

Source: [fifths/distanceFrom.js](https://github.com/danigb/tonal/tree/master/lib/fifths/distanceFrom.js)
Test: [fifths/distanceFromTest.js](https://github.com/danigb/tonal/tree/master/test/fifths/distanceFromTest.js)

----
###### [fifths/transpose](#fifths-module)



#### transpose(pitchClass, number) → {String}



Transpose a pitch class by a number of fifths

__Arguments:__

Name|Type|Description
---|---|---
`pitchClass`|String|the pitch class to be transposed
`number`|Integer|the number of fifths (can be negative)


__Returns:__

Type|Description
---|---
String|the transposed pitch class


__Example:__

```js
transpose('C', 2) // => 'D'
transpose('C5', -2) // => 'Bb'
```

Source: [fifths/transpose.js](https://github.com/danigb/tonal/tree/master/lib/fifths/transpose.js)
Test: [fifths/transposeTest.js](https://github.com/danigb/tonal/tree/master/test/fifths/transposeTest.js)


