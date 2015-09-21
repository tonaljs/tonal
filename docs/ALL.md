# Tonal functions

A list of [all functions](https://github.com/danigb/tonal/tree/master//docs/INDEX.md) available grouped by modules.



__Index of modules__

- __[Pitch](#pitch-module)__ (18 functions):  [alterToAcc](#pitchaltertoacc) [cents](#pitchcents) [enharmonic](#pitchenharmonic) [freq](#pitchfreq) [fromFreq](#pitchfromfreq) [fromKey](#pitchfromkey) [fromMidi](#pitchfrommidi) [interval](#pitchinterval) [intervalFrom](#pitchintervalfrom) [intervalTo](#pitchintervalto) [key](#pitchkey) [letter](#pitchletter) [midi](#pitchmidi) [octave](#pitchoctave) [pitch](#pitchpitch) [pitchClass](#pitchpitchclass) [props](#pitchprops) [transpose](#pitchtranspose)
- __[Set](#set-module)__ (3 functions):  [genericSet](#setgenericset) [modes](#setmodes) [pitchSet](#setpitchset)
- __[Scale](#scale-module)__ (7 functions):  [generic](#scalegeneric) [mode](#scalemode) [name](#scalename) [names](#scalenames) [parse](#scaleparse) [scale](#scalescale) [triad](#scaletriad)
- __[Chord](#chord-module)__ (6 functions):  [chord](#chordchord) [fromScale](#chordfromscale) [intervals](#chordintervals) [name](#chordname) [names](#chordnames) [parse](#chordparse)
- __[Interval](#interval-module)__ (9 functions):  [add](#intervaladd) [harmonize](#intervalharmonize) [interval](#intervalinterval) [invert](#intervalinvert) [isInterval](#intervalisinterval) [opposite](#intervalopposite) [props](#intervalprops) [semitones](#intervalsemitones) [simplify](#intervalsimplify)
- __[Key](#key-module)__ (7 functions):  [accidentals](#keyaccidentals) [alteredNotes](#keyalterednotes) [fromPitchSet](#keyfrompitchset) [keyNumber](#keykeynumber) [parse](#keyparse) [pitchSet](#keypitchset) [triads](#keytriads)
- __[Binary-set](#binary-set-module)__ (3 functions):  [allBinarySets](#binary-setallbinarysets) [genericSet](#binary-setgenericset) [toBinary](#binary-settobinary)
- __[Fifths](#fifths-module)__ (3 functions):  [byFifths](#fifthsbyfifths) [fifths](#fifthsfifths) [transpose](#fifthstranspose)

## Pitch module



Number of functions:  18

#### pitch/alterToAcc



<p>Get the accidentals from an alteration number</p>

```js
alterToAcc(1) // => '#'
alterToAcc(3) // => '###'
alterToAcc(0) // => ''
alterToAcc(-1) // => 'b'
alterToAcc(-2) // => 'bb'
```

[alterToAcc.js](https://github.com/danigb/tonal/tree/master//lib/pitch/alterToAcc.js)


#### pitch/cents



<p>Get the distance in cents between pitches or frequencies</p>

```js
cents(440, 444) // => 15.66
cents('A4', 444) // => 15.66
cents('A4', 'A#4') // => 100
```

[cents.js](https://github.com/danigb/tonal/tree/master//lib/pitch/cents.js)


#### pitch/enharmonic



<p>Get the enharmonic of a pitch with a given step</p>

```js
enharmonic('C#4', 'D') // => 'Db4'
enharmonic('B#', 'C') // => 'C'
```

[enharmonic.js](https://github.com/danigb/tonal/tree/master//lib/pitch/enharmonic.js)


#### pitch/freq



<p>Get the pitch frequency in hertzs</p>

```js
freq('A4') // => 440
freq('A3', 444) // => 222
```

[freq.js](https://github.com/danigb/tonal/tree/master//lib/pitch/freq.js)


#### pitch/fromFreq



<p>Given a frequency, get the pitch. It will round the frequency to the nearest<br />pitch frequency</p>

```js
fromFreq(440) // => 'A4'
fromFreq(441) // => 'A4'
```

[fromFreq.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromFreq.js)


#### pitch/fromKey



<p>Get the pitch of the given piano key number</p>

```js
fromKey(40) // => 'C4'
fromKey(49) // => 'A4'
```

[fromKey.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromKey.js)


#### pitch/fromMidi



<p>Get the pitch of the given midi number</p>


[fromMidi.js](https://github.com/danigb/tonal/tree/master//lib/pitch/fromMidi.js)


#### pitch/interval



<p>Get the interval between two pitches</p>

```js
interval('C', 'D') // => 'M2'
['C', 'D', 'Eb'].map(interval.from('C')) // => ['P1', 'M2', 'm3']
```

[interval.js](https://github.com/danigb/tonal/tree/master//lib/pitch/interval.js)


#### pitch/intervalFrom



<p>Partial apply <code>picth/interval</code> to return a interval from a pitch</p>

```js
['C', 'D', 'E'].map(intervalFrom('C')) // => ['1P', '2M', '3M']
```

[intervalFrom.js](https://github.com/danigb/tonal/tree/master//lib/pitch/intervalFrom.js)


#### pitch/intervalTo



<p>Partial apply <code>picth/interval</code> to return a interval to a pitch</p>

```js
['C', 'D', 'E'].map(intervalTo('E')) // => ['3M', '2M', '1P']
```

[intervalTo.js](https://github.com/danigb/tonal/tree/master//lib/pitch/intervalTo.js)


#### pitch/key



<p>Get the key number from a pitch</p>

```js
key(49) // => 'A4'
```

[key.js](https://github.com/danigb/tonal/tree/master//lib/pitch/key.js)


#### pitch/letter



<p>Get the letter of a pitch (and optionally move a number of steps)</p>

```js
letter('c#5') // => 'C'
letter('c', 0) // => 'C'
letter('c', 1) // => 'D'
letter('c', 2) // => 'E'
```

[letter.js](https://github.com/danigb/tonal/tree/master//lib/pitch/letter.js)


#### pitch/midi



<p>Get the midi of a pitch</p>

```js
midi('a4') // => 69
```

[midi.js](https://github.com/danigb/tonal/tree/master//lib/pitch/midi.js)


#### pitch/octave



<p>Get the octave of a pitch</p>

```js
octave('a4') // => 4
```

[octave.js](https://github.com/danigb/tonal/tree/master//lib/pitch/octave.js)


#### pitch/pitch



<p>Get the scientific notation of a pitch (and optionally change its octave and alteration)</p>

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


#### pitch/pitchClass



<p>Get the <a href="https://en.wikipedia.org/wiki/Pitch_class">pitchClass</a> of a pitch</p>

```js
pitchClass('a4') // => 69
```

[pitchClass.js](https://github.com/danigb/tonal/tree/master//lib/pitch/pitchClass.js)


#### pitch/props



<p>Get pitch properties</p>

```js
props('C#2') // => { }
```

[props.js](https://github.com/danigb/tonal/tree/master//lib/pitch/props.js)


#### pitch/transpose



<p>Transpose a pitch by an interval</p>

```js
transpose('E', 'M2') // => 'F#4'
transpose('C', 'M-2') // => 'Bb3'
['M2', 'm3', 'P-8'].map(tranapose('C')) // => ['D4', 'Eb4', 'C3']
['C', 'D', 'E'].map(transpose('M2')) // => ['D4', 'E4', 'F#4']
```

[transpose.js](https://github.com/danigb/tonal/tree/master//lib/pitch/transpose.js)



## Set module



Number of functions:  3

#### set/genericSet



<p>Get the intervals of a pitch set</p>

```js
toIntervals()
```

[genericSet.js](https://github.com/danigb/tonal/tree/master//lib/set/genericSet.js)


#### set/modes



<p>Return all modes of a pitch set</p>

```js
modes('C D E') // => [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]]
```

[modes.js](https://github.com/danigb/tonal/tree/master//lib/set/modes.js)


#### set/pitchSet



<p>Create a pitch class set from a collection of pitches.</p>

```js
pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']
```

[pitchSet.js](https://github.com/danigb/tonal/tree/master//lib/set/pitchSet.js)



## Scale module



Number of functions:  7

#### scale/generic



<p>Get a generic scale (the intervals) from a scale name without tonic</p>

```js
generic('C major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
```

[generic.js](https://github.com/danigb/tonal/tree/master//lib/scale/generic.js)


#### scale/mode



<p>Get the mode of a scale</p>

```js
mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
```

[mode.js](https://github.com/danigb/tonal/tree/master//lib/scale/mode.js)


#### scale/name



<p>Given a scale notes return the scale name (if any)</p>

```js
name('C D E F G A B') // => 'C major'
```

[name.js](https://github.com/danigb/tonal/tree/master//lib/scale/name.js)


#### scale/names



<p>Get the known scale names</p>

```js
names() => ['major', 'minor', ....]
```

[names.js](https://github.com/danigb/tonal/tree/master//lib/scale/names.js)


#### scale/parse



<p>Get the components of a scale name</p>

```js
parse('C major') // => { tonic: 'C', type: 'major' }
```

[parse.js](https://github.com/danigb/tonal/tree/master//lib/scale/parse.js)


#### scale/scale



<p>Get the scale (pitch set) of a scale name</p>

```js
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('D diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']
```

[scale.js](https://github.com/danigb/tonal/tree/master//lib/scale/scale.js)


#### scale/triad



<p>Get a triad from a set starting from the first note, a simplistic implementation.</p>

```js
triad(scale('C major')) // => ['C', 'E', 'G']
triad(scale('C major'), 5) // => ['C', 'E', 'G', 'B', 'D']
```

[triad.js](https://github.com/danigb/tonal/tree/master//lib/scale/triad.js)



## Chord module



Number of functions:  6

#### chord/chord



<p>Get chord notes or intervals by its type and (optionally) tonic pitch</p>

```js
chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
chord('7b5') // => ['1P', '3M', '5d', '7m']
chord('7b5', 'Bb2')
```

[chord.js](https://github.com/danigb/tonal/tree/master//lib/chord/chord.js)


#### chord/fromScale



<p>Return all the chord names of a given scale</p>


[fromScale.js](https://github.com/danigb/tonal/tree/master//lib/chord/fromScale.js)


#### chord/intervals



<p>Get the intervals of a chord name</p>

```js
intervals('Cmaj7') // => ['1P', '3M', '5P', '7M']
```

[intervals.js](https://github.com/danigb/tonal/tree/master//lib/chord/intervals.js)


#### chord/name



<p>Get the chord name(s) of a given pitches</p>


[name.js](https://github.com/danigb/tonal/tree/master//lib/chord/name.js)


#### chord/names





```js
names() => ['major', 'minor', ....]
```

[names.js](https://github.com/danigb/tonal/tree/master//lib/chord/names.js)


#### chord/parse



<p>Get the components of a chord name</p>

```js
parse('C#Maj7') // => { tonic: 'C#', type: 'Maj7' }
parse('7b5') // => { tonic: null, type: '7b5' }
```

[parse.js](https://github.com/danigb/tonal/tree/master//lib/chord/parse.js)



## Interval module



Number of functions:  9

#### interval/add



<p>Add two intervals</p>

```js
add('M2', 'M2') // => 'M3'
```

[add.js](https://github.com/danigb/tonal/tree/master//lib/interval/add.js)


#### interval/harmonize



<p>Given a collection of intervals, and a tonic create a collection of pitches</p>

```js
harmonize('C2', ['P1 P5']) // => ['C2', 'G2']
```

[harmonize.js](https://github.com/danigb/tonal/tree/master//lib/interval/harmonize.js)


#### interval/interval



<p>Get an interval properties from a string or a number, and optionally a quality<br />and octave.</p>

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


#### interval/invert



<p>Get the <a href="https://en.wikipedia.org/wiki/Interval_(music">inversion</a>#Inversion)<br />of an interval.</p>

```js
invert('M9') // => 'M2'
invert('M-10') // => 'M-3'
invert('P-11', true) // => 'P4'
```

[invert.js](https://github.com/danigb/tonal/tree/master//lib/interval/invert.js)


#### interval/isInterval



<p>Test if a string is a valid interval</p>

```js
isInterval('blah') // false
isInterval('P5') // true
isInterval('P6') // false
```

[isInterval.js](https://github.com/danigb/tonal/tree/master//lib/interval/isInterval.js)


#### interval/opposite



<p>Get the opposite of an interval</p>

```js
opposite('M2') // => 'M-2'
opposite('P-8') // => 'P8'
```

[opposite.js](https://github.com/danigb/tonal/tree/master//lib/interval/opposite.js)


#### interval/props



<p>Get interval properties</p>

```js
var props = require('tonal/interval/props')
props('-5P') // => { name: '-5P', quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
props('9m') // => { name: '9m', quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }
```

[props.js](https://github.com/danigb/tonal/tree/master//lib/interval/props.js)


#### interval/semitones



<p>Get the semitones of a interval</p>

```js
semitones('5P') // => 7
```

[semitones.js](https://github.com/danigb/tonal/tree/master//lib/interval/semitones.js)


#### interval/simplify



<p>Simplify an interval</p>

```js
simplify('9M') // => '2M'
simplify('-9M') // => '-2M'
simplify('-2M', true) // => '2M'
```

[simplify.js](https://github.com/danigb/tonal/tree/master//lib/interval/simplify.js)



## Key module



Number of functions:  7

#### key/accidentals



<p>Given a key (number) returns the accidentals</p>

```js
accidentals('G major') // => '#'
accidentals('Eb minor') // => 'bbbbbb'
accidentals(3) // => '###'
accidentals(-2) // => 'bb'
```

[accidentals.js](https://github.com/danigb/tonal/tree/master//lib/key/accidentals.js)


#### key/alteredNotes



<p>Given a key, return the altered pitches</p>

```js
alteredNotes('D major') // => ['F#', 'C#']
alteredNotes(3) // => ['F#', 'C#', 'G#']
alteredNotes('bb') // => ['Bb', 'Eb']
```

[alteredNotes.js](https://github.com/danigb/tonal/tree/master//lib/key/alteredNotes.js)


#### key/fromPitchSet



<p>Given a pitch set, return its key</p>

```js
fromPitchSet('C Bb F') // => -1
```

[fromPitchSet.js](https://github.com/danigb/tonal/tree/master//lib/key/fromPitchSet.js)


#### key/keyNumber



<p>Get the key number (the number of sharps or flats) of a key</p>

```js
keyNumber('G major') // => 1
keyNumber('F major') // => -1
keyNumber('C') // => 0
keyNumber('Eb minor') // => -6
keyNumber('##') // => 2
keyNumber('bbb') // => -3
```

[keyNumber.js](https://github.com/danigb/tonal/tree/master//lib/key/keyNumber.js)


#### key/parse



<p>Get the components of a key name</p>

```js
parse('C minor') // => { tonic: 'C', type: 'minor'}
parse('C#') // => { tonic: 'C#', type: 'major'}
```

[parse.js](https://github.com/danigb/tonal/tree/master//lib/key/parse.js)


#### key/pitchSet



<p>Get the pitch class set from a key.</p>

```js
pitchSet('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
pitchSet('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
```

[pitchSet.js](https://github.com/danigb/tonal/tree/master//lib/key/pitchSet.js)


#### key/triads



<p>Get the triads of</p>

```js
triads('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
triads('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
```

[triads.js](https://github.com/danigb/tonal/tree/master//lib/key/triads.js)



## Binary-set module



Number of functions:  3

#### binary-set/allBinarySets



<p>Return all possible set binary numbers</p>


[allBinarySets.js](https://github.com/danigb/tonal/tree/master//lib/binary-set/allBinarySets.js)


#### binary-set/genericSet



<p>Convert a binary set number to an intervals collection</p>

```js
intervals('1P 2M') // => ['1P', '2M']
intervals(2773) // => ['1P', '2M', '3M']
```

[genericSet.js](https://github.com/danigb/tonal/tree/master//lib/binary-set/genericSet.js)


#### binary-set/toBinary



<p>Return the binary set representation of a collection of intervals</p>

```js
toBinary('1P 2M') // => '101000000000'
toBinary('1P 9M') // => '101000000000'
toBinary('1P 7M') // => '100000000001'
toBinary('1P 8P') // => '100000000000'
```

[toBinary.js](https://github.com/danigb/tonal/tree/master//lib/binary-set/toBinary.js)



## Fifths module



Number of functions:  3

#### fifths/byFifths



<p>Get a comparator function to sort a collection of pitch classes</p>

```js
['C#', 'G#', 'F#'].sort(byFifths()) // => ['F#', 'C#', 'D#']
```

[byFifths.js](https://github.com/danigb/tonal/tree/master//lib/fifths/byFifths.js)


#### fifths/fifths



<p>Return the number of fifths between two pitch classes.</p>

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


#### fifths/transpose



<p>Transpose a pitch class by a number of fifths</p>

```js
transpose('C', 2) // => 'D'
transpose('C5', -2) // => 'Bb'
```

[transpose.js](https://github.com/danigb/tonal/tree/master//lib/fifths/transpose.js)



