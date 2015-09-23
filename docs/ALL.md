# Tonal functions

A list of [all functions](https://github.com/danigb/tonal/tree/master//docs/INDEX.md) available grouped by modules.



__Module summary__

- __[Pitch](#pitch-module)__ -  [alterToAcc](#pitchaltertoacc), [cents](#pitchcents), [enharmonic](#pitchenharmonic), [fromFreq](#pitchfromfreq), [fromKey](#pitchfromkey), [fromMidi](#pitchfrommidi), [interval](#pitchinterval), [intervalFrom](#pitchintervalfrom), [intervalTo](#pitchintervalto), [letter](#pitchletter), [octave](#pitchoctave), [pitch](#pitchpitch), [pitchClass](#pitchpitchclass), [props](#pitchprops), [toFreq](#pitchtofreq), [toKey](#pitchtokey), [toMidi](#pitchtomidi), [transpose](#pitchtranspose)
- __[Scale](#scale-module)__ -  [intervals](#scaleintervals), [mode](#scalemode), [name](#scalename), [scale](#scalescale), [scaleNames](#scalescalenames), [triad](#scaletriad)
- __[Chord](#chord-module)__ -  [chord](#chordchord), [chordNames](#chordchordnames), [fromScale](#chordfromscale), [intervals](#chordintervals), [name](#chordname)
- __[Interval](#interval-module)__ -  [add](#intervaladd), [harmonize](#intervalharmonize), [interval](#intervalinterval), [invert](#intervalinvert), [isInterval](#intervalisinterval), [opposite](#intervalopposite), [props](#intervalprops), [semitones](#intervalsemitones), [simplify](#intervalsimplify)
- __[PitchSet](#pitchset-module)__ -  [modes](#pitchsetmodes), [pitchSet](#pitchsetpitchset), [toIntervals](#pitchsettointervals)
- __[BinarySet](#binaryset-module)__ -  [binarySet](#binarysetbinaryset), [binarySets](#binarysetbinarysets), [toIntervals](#binarysettointervals)
- __[Key](#key-module)__ -  [accidentals](#keyaccidentals), [alteredNotes](#keyalterednotes), [fromPitchSet](#keyfrompitchset), [keyNumber](#keykeynumber), [parse](#keyparse), [pitchSet](#keypitchset), [triads](#keytriads)
- __[Fifths](#fifths-module)__ -  [byFifths](#fifthsbyfifths), [fifths](#fifthsfifths), [fifthsFrom](#fifthsfifthsfrom), [transpose](#fifthstranspose)

## Pitch module



[Back to top](#tonal-functions)




This is the building block of tonal. Pitches are just strings in scientific notation. You can create it from midi numbers or frequencies (and reverse), query for its properties, transpose them or find interval distances. Almost everything you need from pitches is here.

### Resources

Dive into the world of pitch class sets:

- http://www.mta.ca/pc-set/pc-set_new/pages/introduction/toc.html
- http://composertools.com/Theory/PCSets/

### Function list

- [alterToAcc](#pitchaltertoacc) -  Get the accidentals from an alteration number
- [cents](#pitchcents) -  Get the distance in cents between pitches or frequencies
- [enharmonic](#pitchenharmonic) -  Get the enharmonic of a pitch with a given step
- [fromFreq](#pitchfromfreq) -  Given a frequency, get the pitch. It will round the frequency to the nearest pitch frequency
- [fromKey](#pitchfromkey) -  Get the pitch of the given piano key number
- [fromMidi](#pitchfrommidi) -  Get the pitch of the given midi number
- [interval](#pitchinterval) -  Get the interval between two pitches
- [intervalFrom](#pitchintervalfrom) -  Partial apply `picth/interval` to return a interval from a pitch
- [intervalTo](#pitchintervalto) -  Partial apply `picth/interval` to return a interval to a pitch
- [letter](#pitchletter) -  Get the letter of a pitch (and optionally move a number of steps)
- [octave](#pitchoctave) -  Get the octave of a pitch
- [pitch](#pitchpitch) -  Get the scientific notation of a pitch (and optionally change its octave and alteration)
- [pitchClass](#pitchpitchclass) -  Get the [pitchClass](https://en.wikipedia.org/wiki/Pitch_class) of a pitch
- [props](#pitchprops) -  Get pitch properties
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

Source: [pitch/alterToAcc.js](https://github.com/danigb/tonal/tree/master//lib/pitch/alterToAcc.js)
Test: [pitch/alterToAccTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/alterToAccTest.js)

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

Source: [pitch/cents.js](https://github.com/danigb/tonal/tree/master//lib/pitch/cents.js)
Test: [pitch/centsTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/centsTest.js)

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

Source: [pitch/enharmonic.js](https://github.com/danigb/tonal/tree/master//lib/pitch/enharmonic.js)
Test: [pitch/enharmonicTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/enharmonicTest.js)

----
###### [pitch/fromFreq](#pitch-module)



#### fromFreq(freq) → {String}



Given a frequency, get the pitch. It will round the frequency to the nearest
pitch frequency

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
fromFreq(441) // => 'A4'
```

Source: [pitch/fromFreq.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromFreq.js)
Test: [pitch/fromFreqTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/fromFreqTest.js)

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

Source: [pitch/fromKey.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromKey.js)
Test: [pitch/fromKeyTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/fromKeyTest.js)

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

Source: [pitch/fromMidi.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromMidi.js)
Test: [pitch/fromMidiTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/fromMidiTest.js)

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

Source: [pitch/interval.js](https://github.com/danigb/tonal/tree/master//lib/pitch/interval.js)
Test: [pitch/intervalTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/intervalTest.js)

----
###### [pitch/intervalFrom](#pitch-module)



#### intervalFrom(from) → {Function}



Partial apply `picth/interval` to return a interval from a pitch

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

Source: [pitch/intervalFrom.js](https://github.com/danigb/tonal/tree/master//lib/pitch/intervalFrom.js)
Test: [pitch/intervalFromTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/intervalFromTest.js)

----
###### [pitch/intervalTo](#pitch-module)



#### intervalTo(to) → {Function}



Partial apply `picth/interval` to return a interval to a pitch

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

Source: [pitch/intervalTo.js](https://github.com/danigb/tonal/tree/master//lib/pitch/intervalTo.js)
Test: [pitch/intervalToTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/intervalToTest.js)

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

Source: [pitch/letter.js](https://github.com/danigb/tonal/tree/master//lib/pitch/letter.js)
Test: [pitch/letterTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/letterTest.js)

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

Source: [pitch/octave.js](https://github.com/danigb/tonal/tree/master//lib/pitch/octave.js)
Test: [pitch/octaveTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/octaveTest.js)

----
###### [pitch/pitch](#pitch-module)



#### pitch(pitch, alteration, octave) → {String}



Get the scientific notation of a pitch (and optionally change its octave and alteration)

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
pitch('c', '#', 2) // => 'C#2'
pitch('c', '#') // => 'C#4'
pitch('c') // => 'C4'
pitch('c#4') // => 'C#4'
pitch('C#4', 'b', 2) // => 'Cb2'
pitch('C#4', null, 2) // => 'C#2'
pitch('C7', -1) // => 'Cb7'
pitch('bluf') // => null
```

Source: [pitch/pitch.js](https://github.com/danigb/tonal/tree/master//lib/pitch/pitch.js)
Test: [pitch/pitchTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/pitchTest.js)

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
pitchClass('a4') // => 69
```

Source: [pitch/pitchClass.js](https://github.com/danigb/tonal/tree/master//lib/pitch/pitchClass.js)
Test: [pitch/pitchClassTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/pitchClassTest.js)

----
###### [pitch/props](#pitch-module)



#### props(pitch) → {Object}



Get pitch properties

It returns an object with the following properties:

- __name__: the given pitch string
- __letter__: the pitch letter __always__ in uppercase
- __str__: the pitch in scientific representation
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

Source: [pitch/props.js](https://github.com/danigb/tonal/tree/master//lib/pitch/props.js)
Test: [pitch/propsTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/propsTest.js)

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

Source: [pitch/toFreq.js](https://github.com/danigb/tonal/tree/master//lib/pitch/toFreq.js)
Test: [pitch/toFreqTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/toFreqTest.js)

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

Source: [pitch/toKey.js](https://github.com/danigb/tonal/tree/master//lib/pitch/toKey.js)
Test: [pitch/toKeyTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/toKeyTest.js)

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

Source: [pitch/toMidi.js](https://github.com/danigb/tonal/tree/master//lib/pitch/toMidi.js)
Test: [pitch/toMidiTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/toMidiTest.js)

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

Source: [pitch/transpose.js](https://github.com/danigb/tonal/tree/master//lib/pitch/transpose.js)
Test: [pitch/transposeTest.js](https://github.com/danigb/tonal/tree/master//test/pitch/transposeTest.js)


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

- [intervals](#scaleintervals) -  Get the intervals of a scale name (without tonic)
- [mode](#scalemode) -  Get the mode of a scale
- [name](#scalename) -  Given a scale notes return the scale name (if any)
- [scale](#scalescale) -  Get the scale (pitch set) of a scale name
- [scaleNames](#scalescalenames) -  Get all known scale names
- [triad](#scaletriad) -  Get a triad from a set starting from the first note, a simplistic implementation.



### API

----
###### [scale/intervals](#scale-module)



#### intervals(name) → {Array}



Get the intervals of a scale name (without tonic)

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
generic('major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
```

Source: [scale/intervals.js](https://github.com/danigb/tonal/tree/master//lib/scale/intervals.js)
Test: [scale/intervalsTest.js](https://github.com/danigb/tonal/tree/master//test/scale/intervalsTest.js)

----
###### [scale/mode](#scale-module)



#### mode(name, num) → {Array}



Get the mode of a scale

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

Source: [scale/mode.js](https://github.com/danigb/tonal/tree/master//lib/scale/mode.js)
Test: [scale/modeTest.js](https://github.com/danigb/tonal/tree/master//test/scale/modeTest.js)

----
###### [scale/name](#scale-module)



#### name(scale) → {String}



Given a scale notes return the scale name (if any)

__Arguments:__

Name|Type|Description
---|---|---
`scale`|Array,String|the scale notes


__Returns:__

Type|Description
---|---
String|the scale name or null if not found


__Example:__

```js
name('C D E F G A B') // => 'C major'
```

Source: [scale/name.js](https://github.com/danigb/tonal/tree/master//lib/scale/name.js)
Test: [scale/nameTest.js](https://github.com/danigb/tonal/tree/master//test/scale/nameTest.js)

----
###### [scale/scale](#scale-module)



#### scale(name, tonic) → {Array}



Get the scale (pitch set) of a scale name

If the scale name does not contains the tonic, a list of intervals is returned

__Arguments:__

Name|Type|Description
---|---|---
`name`|String|the scale name
`tonic`|String|(Optional) the tonic


__Returns:__

Type|Description
---|---
Array|an array of intervals or notes (if tonic is present)


__Example:__

```js
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('D diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']
```

Source: [scale/scale.js](https://github.com/danigb/tonal/tree/master//lib/scale/scale.js)
Test: [scale/scaleTest.js](https://github.com/danigb/tonal/tree/master//test/scale/scaleTest.js)

----
###### [scale/scaleNames](#scale-module)



#### scaleNames() → {Array}



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

Source: [scale/scaleNames.js](https://github.com/danigb/tonal/tree/master//lib/scale/scaleNames.js)
Test: [scale/scaleNamesTest.js](https://github.com/danigb/tonal/tree/master//test/scale/scaleNamesTest.js)

----
###### [scale/triad](#scale-module)



#### triad(set, len) → {}



Get a triad from a set starting from the first note, a simplistic implementation.

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

Source: [scale/triad.js](https://github.com/danigb/tonal/tree/master//lib/scale/triad.js)
Test: [scale/triadTest.js](https://github.com/danigb/tonal/tree/master//test/scale/triadTest.js)


## Chord module



[Back to top](#tonal-functions)


# Chord module

Create chords by name and detect a chord by its pitches.

It uses a big .json dataset to get the chord intervals from the name.

### Function list

- [chord](#chordchord) -  Get chord notes or intervals by its type and (optionally) tonic pitch
- [chordNames](#chordchordnames) -  Get all known scale names
- [fromScale](#chordfromscale) -  Get the chord names that _fits_ a given scale
- [intervals](#chordintervals) -  Get the intervals of a chord name
- [name](#chordname) -  Get the chord name(s) of a given pitches



### API

----
###### [chord/chord](#chord-module)



#### chord(name, tonic) → {Array}



Get chord notes or intervals by its type and (optionally) tonic pitch

__Arguments:__

Name|Type|Description
---|---|---
`name`|String|the chord name (may include the tonic)
`tonic`|String|(Optional) the tonic pitch


__Returns:__

Type|Description
---|---
Array|an array of intervals or notes (if the tonic is provided)


__Example:__

```js
chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
chord('7b5') // => ['1P', '3M', '5d', '7m']
chord('7b5', 'Bb2')
```

Source: [chord/chord.js](https://github.com/danigb/tonal/tree/master//lib/chord/chord.js)
Test: [chord/chordTest.js](https://github.com/danigb/tonal/tree/master//test/chord/chordTest.js)

----
###### [chord/chordNames](#chord-module)



#### chordNames() → {Array}



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

Source: [chord/chordNames.js](https://github.com/danigb/tonal/tree/master//lib/chord/chordNames.js)
Test: [chord/chordNamesTest.js](https://github.com/danigb/tonal/tree/master//test/chord/chordNamesTest.js)

----
###### [chord/fromScale](#chord-module)



#### fromScale() → {}



Get the chord names that _fits_ a given scale

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
fromScale('C D E F G A B') // => ['CM', 'CMaj7']
```

Source: [chord/fromScale.js](https://github.com/danigb/tonal/tree/master//lib/chord/fromScale.js)
Test: [chord/fromScaleTest.js](https://github.com/danigb/tonal/tree/master//test/chord/fromScaleTest.js)

----
###### [chord/intervals](#chord-module)



#### intervals(name) → {Array}



Get the intervals of a chord name

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
intervals('Cmaj7') // => ['1P', '3M', '5P', '7M']
```

Source: [chord/intervals.js](https://github.com/danigb/tonal/tree/master//lib/chord/intervals.js)
Test: [chord/intervalsTest.js](https://github.com/danigb/tonal/tree/master//test/chord/intervalsTest.js)

----
###### [chord/name](#chord-module)



#### name() → {}



Get the chord name(s) of a given pitches

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__


Source: [chord/name.js](https://github.com/danigb/tonal/tree/master//lib/chord/name.js)
Test: [chord/nameTest.js](https://github.com/danigb/tonal/tree/master//test/chord/nameTest.js)


## Interval module



[Back to top](#tonal-functions)




Create and manipulate intervals. An interval in tonal is a string in the form: [direction+]number+quality. `'1P'` and `-9m` are valid intervals.

You can get the interval properties with `interval/props` and manipulate in the standard ways: add two intervals, simplify intervals, get opposite...

### Function list

- [add](#intervaladd) -  Add two intervals
- [harmonize](#intervalharmonize) -  Given a collection of intervals, and a tonic create a collection of pitches
- [interval](#intervalinterval) -  Get an interval properties from a string or a number, and optionally a quality and octave.
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

Source: [interval/add.js](https://github.com/danigb/tonal/tree/master//lib/interval/add.js)
Test: [interval/addTest.js](https://github.com/danigb/tonal/tree/master//test/interval/addTest.js)

----
###### [interval/harmonize](#interval-module)



#### harmonize(tonic, intervals, pitchClassOnly) → {Array}



Given a collection of intervals, and a tonic create a collection of pitches

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

Source: [interval/harmonize.js](https://github.com/danigb/tonal/tree/master//lib/interval/harmonize.js)
Test: [interval/harmonizeTest.js](https://github.com/danigb/tonal/tree/master//test/interval/harmonizeTest.js)

----
###### [interval/interval](#interval-module)



#### interval(interval, quality|alteration, oct) → {}



Get an interval properties from a string or a number, and optionally a quality
and octave.

The quality and octave parameters will override the given string interval

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String,Integer|the interval or the interval number (can be negative to express descengin intervals)
`quality|alteration`|String,Integer|(Optional) the interval quality or numberic alteration (0 is perfect or major). Can be null to avoid override the string
`oct`|Integer|(Optional) the octaves. If negative, the direction of the interval is descendent. 0 by default.


__Returns:__

Type|Description
---|---


__Example:__

```js
interval('2') // => '2M'
interval('2', 'm') // => '2m'
interval('2', 'a', 1) // => '9A'
interval('2', 'a', -1) // => '-9A'
interval('2', null, 1) // => '9M'
interval(-2, 'm', 1) // => '-9m'
interval(-2, -1, 1) // => '-9m'
interval(2, 'AA') // => '2AA'
interval(2, 'AAA') // => null
```

Source: [interval/interval.js](https://github.com/danigb/tonal/tree/master//lib/interval/interval.js)
Test: [interval/intervalTest.js](https://github.com/danigb/tonal/tree/master//test/interval/intervalTest.js)

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

Source: [interval/invert.js](https://github.com/danigb/tonal/tree/master//lib/interval/invert.js)
Test: [interval/invertTest.js](https://github.com/danigb/tonal/tree/master//test/interval/invertTest.js)

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

Source: [interval/isInterval.js](https://github.com/danigb/tonal/tree/master//lib/interval/isInterval.js)
Test: [interval/isIntervalTest.js](https://github.com/danigb/tonal/tree/master//test/interval/isIntervalTest.js)

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

Source: [interval/opposite.js](https://github.com/danigb/tonal/tree/master//lib/interval/opposite.js)
Test: [interval/oppositeTest.js](https://github.com/danigb/tonal/tree/master//test/interval/oppositeTest.js)

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

Source: [interval/props.js](https://github.com/danigb/tonal/tree/master//lib/interval/props.js)
Test: [interval/propsTest.js](https://github.com/danigb/tonal/tree/master//test/interval/propsTest.js)

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

Source: [interval/semitones.js](https://github.com/danigb/tonal/tree/master//lib/interval/semitones.js)
Test: [interval/semitonesTest.js](https://github.com/danigb/tonal/tree/master//test/interval/semitonesTest.js)

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

Source: [interval/simplify.js](https://github.com/danigb/tonal/tree/master//lib/interval/simplify.js)
Test: [interval/simplifyTest.js](https://github.com/danigb/tonal/tree/master//test/interval/simplifyTest.js)


## PitchSet module



[Back to top](#tonal-functions)




A module to create and manipulate pitch class sets. A pitch class set is a collection of pitch classes, where they can't be repeated.

Some tonal functions (like scales, for example) uses pitch sets.

### Function list

- [modes](#pitchsetmodes) -  Return all modes of a pitch set
- [pitchSet](#pitchsetpitchset) -  Create a pitch class set from a collection of pitches.
- [toIntervals](#pitchsettointervals) -  Get the intervals of a pitch set



### API

----
###### [pitchSet/modes](#pitchset-module)



#### modes(pitchSet) → {Array}



Return all modes of a pitch set

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

Source: [pitchSet/modes.js](https://github.com/danigb/tonal/tree/master//lib/pitchSet/modes.js)
Test: [pitchSet/modesTest.js](https://github.com/danigb/tonal/tree/master//test/pitchSet/modesTest.js)

----
###### [pitchSet/pitchSet](#pitchset-module)



#### pitchSet(pitches) → {Array}



Create a pitch class set from a collection of pitches.

The pitch classes are ordered by frequency starting from the first note
of the given collection

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|Array,String|the collection of pitches


__Returns:__

Type|Description
---|---
Array|a pitch set


__Example:__

```js
pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']
```

Source: [pitchSet/pitchSet.js](https://github.com/danigb/tonal/tree/master//lib/pitchSet/pitchSet.js)
Test: [pitchSet/pitchSetTest.js](https://github.com/danigb/tonal/tree/master//test/pitchSet/pitchSetTest.js)

----
###### [pitchSet/toIntervals](#pitchset-module)



#### toIntervals(set) → {Array}



Get the intervals of a pitch set

__Arguments:__

Name|Type|Description
---|---|---
`set`|Array|the pitch set


__Returns:__

Type|Description
---|---
Array|the intervals of the pitch set (starting from 1P)


__Example:__

```js
toIntervals(['C', 'D', 'Eb']) // => ['1P', '2M', '3m']
```

Source: [pitchSet/toIntervals.js](https://github.com/danigb/tonal/tree/master//lib/pitchSet/toIntervals.js)
Test: [pitchSet/toIntervalsTest.js](https://github.com/danigb/tonal/tree/master//test/pitchSet/toIntervalsTest.js)


## BinarySet module



[Back to top](#tonal-functions)




A binary set is a 12 digit binary number that represents a pitch class set.

The first time I've read about it was in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanation is extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

> The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### 2048 scales

All the scales have root, so the smallest scale is '100000000000' (2048) and
the biggest is '111111111111' (4095), so the total number is 2048 (4096 - 2048)

The way to get them all is with the function [`binary-set/allBinarySets`](#binarysetallbinarysets).

Most of they are not interesting enough to be used in music.
For example, at [allthescales.org site](http://allthescales.org) they limit all the possibilities to those with leap < 5 (1490)

### Function list

- [binarySet](#binarysetbinaryset) -  Get the binary set number of a collection of pitches or intervals
- [binarySets](#binarysetbinarysets) -  Return all possible set binary set numbers
- [toIntervals](#binarysettointervals) -  Convert a binary set number to an intervals collection



### API

----
###### [binarySet/binarySet](#binaryset-module)



#### binarySet(collection) → {String}



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

Source: [binarySet/binarySet.js](https://github.com/danigb/tonal/tree/master//lib/binarySet/binarySet.js)
Test: [binarySet/binarySetTest.js](https://github.com/danigb/tonal/tree/master//test/binarySet/binarySetTest.js)

----
###### [binarySet/binarySets](#binaryset-module)



#### binarySets(filter) → {Array}



Return all possible set binary set numbers

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

Source: [binarySet/binarySets.js](https://github.com/danigb/tonal/tree/master//lib/binarySet/binarySets.js)
Test: [binarySet/binarySetsTest.js](https://github.com/danigb/tonal/tree/master//test/binarySet/binarySetsTest.js)

----
###### [binarySet/toIntervals](#binaryset-module)



#### toIntervals(binary) → {Array}



Convert a binary set number to an intervals collection

__Arguments:__

Name|Type|Description
---|---|---
`binary`|String,Integer|an interval list in any of its valid forms


__Returns:__

Type|Description
---|---
Array|An array of intervals


__Example:__

```js
intervals('1P 2M') // => ['1P', '2M']
intervals(2773) // => ['1P', '2M', '3M']
```

Source: [binarySet/toIntervals.js](https://github.com/danigb/tonal/tree/master//lib/binarySet/toIntervals.js)
Test: [binarySet/toIntervalsTest.js](https://github.com/danigb/tonal/tree/master//test/binarySet/toIntervalsTest.js)


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

Source: [key/accidentals.js](https://github.com/danigb/tonal/tree/master//lib/key/accidentals.js)
Test: [key/accidentalsTest.js](https://github.com/danigb/tonal/tree/master//test/key/accidentalsTest.js)

----
###### [key/alteredNotes](#key-module)



#### alteredNotes() → {}



Given a key, return the altered pitches

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

Source: [key/alteredNotes.js](https://github.com/danigb/tonal/tree/master//lib/key/alteredNotes.js)
Test: [key/alteredNotesTest.js](https://github.com/danigb/tonal/tree/master//test/key/alteredNotesTest.js)

----
###### [key/fromPitchSet](#key-module)



#### fromPitchSet() → {}



Given a pitch set, return its key

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

Source: [key/fromPitchSet.js](https://github.com/danigb/tonal/tree/master//lib/key/fromPitchSet.js)
Test: [key/fromPitchSetTest.js](https://github.com/danigb/tonal/tree/master//test/key/fromPitchSetTest.js)

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

Source: [key/keyNumber.js](https://github.com/danigb/tonal/tree/master//lib/key/keyNumber.js)
Test: [key/keyNumberTest.js](https://github.com/danigb/tonal/tree/master//test/key/keyNumberTest.js)

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

Source: [key/parse.js](https://github.com/danigb/tonal/tree/master//lib/key/parse.js)
Test: [key/parseTest.js](https://github.com/danigb/tonal/tree/master//test/key/parseTest.js)

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

Source: [key/pitchSet.js](https://github.com/danigb/tonal/tree/master//lib/key/pitchSet.js)
Test: [key/pitchSetTest.js](https://github.com/danigb/tonal/tree/master//test/key/pitchSetTest.js)

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

Source: [key/triads.js](https://github.com/danigb/tonal/tree/master//lib/key/triads.js)
Test: [key/triadsTest.js](https://github.com/danigb/tonal/tree/master//test/key/triadsTest.js)


## Fifths module



[Back to top](#tonal-functions)




Generate line or cycle of fifths, and calculate distances in fifths

```js
var distance = require('tonal/fifths/distance')
distance('F', 'C') // => -1
```

### Resources

- The line of fifths by David Temperley: http://www.theory.esm.rochester.edu/temperley/papers/temperley-ma00.pdf

### Function list

- [byFifths](#fifthsbyfifths) -  Get a comparator function to sort a collection of pitch classes
- [fifths](#fifthsfifths) -  Return the number of fifths between two pitch classes.
- [fifthsFrom](#fifthsfifthsfrom) -  Create a function to get fifths distance from a given note.
- [transpose](#fifthstranspose) -  Transpose a pitch class by a number of fifths



### API

----
###### [fifths/byFifths](#fifths-module)



#### byFifths(from) → {Function}



Get a comparator function to sort a collection of pitch classes

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

Source: [fifths/byFifths.js](https://github.com/danigb/tonal/tree/master//lib/fifths/byFifths.js)
Test: [fifths/byFifthsTest.js](https://github.com/danigb/tonal/tree/master//test/fifths/byFifthsTest.js)

----
###### [fifths/fifths](#fifths-module)



#### fifths(pitch, from) → {Integer}



Return the number of fifths between two pitch classes.

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to calc the fifths distance to
`from`|String|(Optional) the pitch to calc the fifths distance from (C if not specified)


__Returns:__

Type|Description
---|---
Integer|the number fifths between the two pitches


__Example:__

```js
fifths('C') // => 0
fifths('G') // => 1
fifths('D') // => 2
fifths('F') // => -1
fifths('Bb') // => -2
fifths('A', 'D') // => 1
fifths('C4', 'C2') // => 0
```

Source: [fifths/fifths.js](https://github.com/danigb/tonal/tree/master//lib/fifths/fifths.js)
Test: [fifths/fifthsTest.js](https://github.com/danigb/tonal/tree/master//test/fifths/fifthsTest.js)

----
###### [fifths/fifthsFrom](#fifths-module)



#### fifthsFrom(from) → {function}



Create a function to get fifths distance from a given note.

__Arguments:__

Name|Type|Description
---|---|---
`from`|String|the from note of the fifths distance


__Returns:__

Type|Description
---|---
function|the functtion to calculate distances


__Example:__

```js
['A', 'B', 'C'].map(fifthsFrom('G'))
```

Source: [fifths/fifthsFrom.js](https://github.com/danigb/tonal/tree/master//lib/fifths/fifthsFrom.js)
Test: [fifths/fifthsFromTest.js](https://github.com/danigb/tonal/tree/master//test/fifths/fifthsFromTest.js)

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

Source: [fifths/transpose.js](https://github.com/danigb/tonal/tree/master//lib/fifths/transpose.js)
Test: [fifths/transposeTest.js](https://github.com/danigb/tonal/tree/master//test/fifths/transposeTest.js)


