# Tonal functions

A list of [all functions](https://github.com/danigb/tonal/tree/master//docs/INDEX.md) available grouped by modules.



__Index of modules__

- __[Pitch](#pitch-module)__ (18 functions):  [alterToAcc](#pitchaltertoacc) [cents](#pitchcents) [enharmonic](#pitchenharmonic) [freq](#pitchfreq) [fromFreq](#pitchfromfreq) [fromKey](#pitchfromkey) [fromMidi](#pitchfrommidi) [interval](#pitchinterval) [intervalFrom](#pitchintervalfrom) [intervalTo](#pitchintervalto) [key](#pitchkey) [letter](#pitchletter) [midi](#pitchmidi) [octave](#pitchoctave) [pitch](#pitchpitch) [pitchClass](#pitchpitchclass) [props](#pitchprops) [transpose](#pitchtranspose)
- __[Set](#set-module)__ (3 functions):  [genericSet](#setgenericset) [modes](#setmodes) [pitchSet](#setpitchset)
- __[Scale](#scale-module)__ (6 functions):  [intervals](#scaleintervals) [mode](#scalemode) [name](#scalename) [scale](#scalescale) [scaleNames](#scalescalenames) [triad](#scaletriad)
- __[Chord](#chord-module)__ (6 functions):  [chord](#chordchord) [chordNames](#chordchordnames) [deparse](#chorddeparse) [fromScale](#chordfromscale) [intervals](#chordintervals) [name](#chordname)
- __[Interval](#interval-module)__ (9 functions):  [add](#intervaladd) [harmonize](#intervalharmonize) [interval](#intervalinterval) [invert](#intervalinvert) [isInterval](#intervalisinterval) [opposite](#intervalopposite) [props](#intervalprops) [semitones](#intervalsemitones) [simplify](#intervalsimplify)
- __[Key](#key-module)__ (7 functions):  [accidentals](#keyaccidentals) [alteredNotes](#keyalterednotes) [fromPitchSet](#keyfrompitchset) [keyNumber](#keykeynumber) [parse](#keyparse) [pitchSet](#keypitchset) [triads](#keytriads)
- __[Binary-set](#binary-set-module)__ (3 functions):  [allBinarySets](#binary-setallbinarysets) [genericSet](#binary-setgenericset) [toBinary](#binary-settobinary)
- __[Fifths](#fifths-module)__ (4 functions):  [byFifths](#fifthsbyfifths) [fifths](#fifthsfifths) [fifthsFrom](#fifthsfifthsfrom) [transpose](#fifthstranspose)

## Pitch module



Number of functions:  18

----
###### pitch/alterToAcc



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

[alterToAcc.js](https://github.com/danigb/tonal/tree/master//lib/pitch/alterToAcc.js)


----
###### pitch/cents



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

[cents.js](https://github.com/danigb/tonal/tree/master//lib/pitch/cents.js)


----
###### pitch/enharmonic



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

[enharmonic.js](https://github.com/danigb/tonal/tree/master//lib/pitch/enharmonic.js)


----
###### pitch/freq



#### freq(pitch, tuning) → {Float}



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
freq('A4') // => 440
freq('A3', 444) // => 222
```

[freq.js](https://github.com/danigb/tonal/tree/master//lib/pitch/freq.js)


----
###### pitch/fromFreq



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

[fromFreq.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromFreq.js)


----
###### pitch/fromKey



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

[fromKey.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromKey.js)


----
###### pitch/fromMidi



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

[fromMidi.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromMidi.js)


----
###### pitch/interval



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

[interval.js](https://github.com/danigb/tonal/tree/master//lib/pitch/interval.js)


----
###### pitch/intervalFrom



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

[intervalFrom.js](https://github.com/danigb/tonal/tree/master//lib/pitch/intervalFrom.js)


----
###### pitch/intervalTo



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

[intervalTo.js](https://github.com/danigb/tonal/tree/master//lib/pitch/intervalTo.js)


----
###### pitch/key



#### key(pitch) → {Integer}



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
key(49) // => 'A4'
```

[key.js](https://github.com/danigb/tonal/tree/master//lib/pitch/key.js)


----
###### pitch/letter



#### letter() → {}



Get the letter of a pitch (and optionally move a number of steps)



__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
letter('c#5') // => 'C'
letter('c', 0) // => 'C'
letter('c', 1) // => 'D'
letter('c', 2) // => 'E'
```

[letter.js](https://github.com/danigb/tonal/tree/master//lib/pitch/letter.js)


----
###### pitch/midi



#### midi(pitch) → {Interger}



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
midi('a4') // => 69
```

[midi.js](https://github.com/danigb/tonal/tree/master//lib/pitch/midi.js)


----
###### pitch/octave



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

[octave.js](https://github.com/danigb/tonal/tree/master//lib/pitch/octave.js)


----
###### pitch/pitch



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

[pitch.js](https://github.com/danigb/tonal/tree/master//lib/pitch/pitch.js)


----
###### pitch/pitchClass



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

[pitchClass.js](https://github.com/danigb/tonal/tree/master//lib/pitch/pitchClass.js)


----
###### pitch/props



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

[props.js](https://github.com/danigb/tonal/tree/master//lib/pitch/props.js)


----
###### pitch/transpose



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

[transpose.js](https://github.com/danigb/tonal/tree/master//lib/pitch/transpose.js)



## Set module



Number of functions:  3

----
###### set/genericSet



#### genericSet() → {}



Get the intervals of a pitch set



__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
toIntervals()
```

[genericSet.js](https://github.com/danigb/tonal/tree/master//lib/set/genericSet.js)


----
###### set/modes



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

[modes.js](https://github.com/danigb/tonal/tree/master//lib/set/modes.js)


----
###### set/pitchSet



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

[pitchSet.js](https://github.com/danigb/tonal/tree/master//lib/set/pitchSet.js)



## Scale module



Number of functions:  6

----
###### scale/intervals



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

[intervals.js](https://github.com/danigb/tonal/tree/master//lib/scale/intervals.js)


----
###### scale/mode



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

[mode.js](https://github.com/danigb/tonal/tree/master//lib/scale/mode.js)


----
###### scale/name



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

[name.js](https://github.com/danigb/tonal/tree/master//lib/scale/name.js)


----
###### scale/scale



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

[scale.js](https://github.com/danigb/tonal/tree/master//lib/scale/scale.js)


----
###### scale/scaleNames



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

[scaleNames.js](https://github.com/danigb/tonal/tree/master//lib/scale/scaleNames.js)


----
###### scale/triad



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

[triad.js](https://github.com/danigb/tonal/tree/master//lib/scale/triad.js)



## Chord module



Number of functions:  6

----
###### chord/chord



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

[chord.js](https://github.com/danigb/tonal/tree/master//lib/chord/chord.js)


----
###### chord/chordNames



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

[chordNames.js](https://github.com/danigb/tonal/tree/master//lib/chord/chordNames.js)


----
###### chord/deparse



#### deparse(chord) → {Object}



Get the components of a chord name

The returned object has the properties:

- __tonic__: the tonic note or null if not specified
- __type__: the chord type



__Arguments:__

Name|Type|Description
---|---|---
`chord`|String|the chord string to be parsed


__Returns:__

Type|Description
---|---
Object|the chord object


__Example:__

```js
parse('C#Maj7') // => { tonic: 'C#', type: 'Maj7' }
parse('7b5') // => { tonic: null, type: '7b5' }
parse('c#Maj7') // => { tonic: null, type: 'c#Maj7' }
parse('add9') // => { tonic: null, type: 'add9'}
```

[deparse.js](https://github.com/danigb/tonal/tree/master//lib/chord/deparse.js)


----
###### chord/fromScale



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

[fromScale.js](https://github.com/danigb/tonal/tree/master//lib/chord/fromScale.js)


----
###### chord/intervals



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

[intervals.js](https://github.com/danigb/tonal/tree/master//lib/chord/intervals.js)


----
###### chord/name



#### name() → {}



Get the chord name(s) of a given pitches



__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__


[name.js](https://github.com/danigb/tonal/tree/master//lib/chord/name.js)



## Interval module



Number of functions:  9

----
###### interval/add



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

[add.js](https://github.com/danigb/tonal/tree/master//lib/interval/add.js)


----
###### interval/harmonize



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

[harmonize.js](https://github.com/danigb/tonal/tree/master//lib/interval/harmonize.js)


----
###### interval/interval



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

[interval.js](https://github.com/danigb/tonal/tree/master//lib/interval/interval.js)


----
###### interval/invert



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

[invert.js](https://github.com/danigb/tonal/tree/master//lib/interval/invert.js)


----
###### interval/isInterval



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

[isInterval.js](https://github.com/danigb/tonal/tree/master//lib/interval/isInterval.js)


----
###### interval/opposite



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

[opposite.js](https://github.com/danigb/tonal/tree/master//lib/interval/opposite.js)


----
###### interval/props



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

[props.js](https://github.com/danigb/tonal/tree/master//lib/interval/props.js)


----
###### interval/semitones



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

[semitones.js](https://github.com/danigb/tonal/tree/master//lib/interval/semitones.js)


----
###### interval/simplify



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

[simplify.js](https://github.com/danigb/tonal/tree/master//lib/interval/simplify.js)



## Key module



Number of functions:  7

----
###### key/accidentals



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

[accidentals.js](https://github.com/danigb/tonal/tree/master//lib/key/accidentals.js)


----
###### key/alteredNotes



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

[alteredNotes.js](https://github.com/danigb/tonal/tree/master//lib/key/alteredNotes.js)


----
###### key/fromPitchSet



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

[fromPitchSet.js](https://github.com/danigb/tonal/tree/master//lib/key/fromPitchSet.js)


----
###### key/keyNumber



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

[keyNumber.js](https://github.com/danigb/tonal/tree/master//lib/key/keyNumber.js)


----
###### key/parse



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

[parse.js](https://github.com/danigb/tonal/tree/master//lib/key/parse.js)


----
###### key/pitchSet



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

[pitchSet.js](https://github.com/danigb/tonal/tree/master//lib/key/pitchSet.js)


----
###### key/triads



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

[triads.js](https://github.com/danigb/tonal/tree/master//lib/key/triads.js)



## Binary-set module



Number of functions:  3

----
###### binary-set/allBinarySets



#### allBinarySets() → {}



Return all possible set binary numbers



__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__


[allBinarySets.js](https://github.com/danigb/tonal/tree/master//lib/binary-set/allBinarySets.js)


----
###### binary-set/genericSet



#### genericSet(binary) → {Array}



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

[genericSet.js](https://github.com/danigb/tonal/tree/master//lib/binary-set/genericSet.js)


----
###### binary-set/toBinary



#### toBinary(intervals) → {String}



Return the binary set representation of a collection of intervals



__Arguments:__

Name|Type|Description
---|---|---
`intervals`|Array,String|a collection of intervals


__Returns:__

Type|Description
---|---
String|a binary number


__Example:__

```js
toBinary('1P 2M') // => '101000000000'
toBinary('1P 9M') // => '101000000000'
toBinary('1P 7M') // => '100000000001'
toBinary('1P 8P') // => '100000000000'
```

[toBinary.js](https://github.com/danigb/tonal/tree/master//lib/binary-set/toBinary.js)



## Fifths module



Number of functions:  4

----
###### fifths/byFifths



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

[byFifths.js](https://github.com/danigb/tonal/tree/master//lib/fifths/byFifths.js)


----
###### fifths/fifths



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

[fifths.js](https://github.com/danigb/tonal/tree/master//lib/fifths/fifths.js)


----
###### fifths/fifthsFrom



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

[fifthsFrom.js](https://github.com/danigb/tonal/tree/master//lib/fifths/fifthsFrom.js)


----
###### fifths/transpose



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

[transpose.js](https://github.com/danigb/tonal/tree/master//lib/fifths/transpose.js)



