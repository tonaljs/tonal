# Tonal functions
A list of all functions available grouped by modules.



## Pitch module


Number of functions: 18

#### alterToAcc


<p>Get the accidentals from an alteration number</p>

```js
alterToAcc(1) // => '#'
alterToAcc(3) // => '###'
alterToAcc(0) // => ''
alterToAcc(-1) // => 'b'
alterToAcc(-2) // => 'bb'
```

#### cents


<p>Return the distance in cents between to pitches or frequencies with two<br />decimals precision</p>

```js
cents(440, 444) // => 15.66
cents('A4', 444) // => 15.66
cents('A4', 'A#4') // => 100
```

#### enharmonic


<p>Get the enharmonic of a pitch with a given step</p>

```js
enharmonic('C#4', 'D') // => 'Db4'
enharmonic('B#', 'C') // => 'C'
```

#### freq


<p>Get the pitch frequency in hertzs</p>

```js
var freq = require('tonal/freq')
freq('A4') // => 440
freq('A3', 444) // => 222
```

#### fromFreq


<p>Given a frequency, get the pitch. It will round the frequency to the nearest<br />pitch frequency</p>

```js
fromFreq(440) // => 'A4'
fromFreq(441) // => 'A4'
```

#### fromKey


<p>Get the pitch of the given piano key number</p>

```js
fromKey(40) // => 'C4'
fromKey(49) // => 'A4'
```

#### fromMidi


<p>Get the pitch of the given midi number</p>


#### interval


<p>Get the interval between two pitches</p>

```js
interval('C', 'D') // => 'M2'
['C', 'D', 'Eb'].map(interval.from('C')) // => ['P1', 'M2', 'm3']
```

#### intervalFrom


<p>Partial apply <code>picth/interval</code> to return a interval from a pitch</p>

```js
['C', 'D', 'E'].map(intervalFrom('C')) // => ['1P', '2M', '3M']
```

#### intervalTo


<p>Partial apply <code>picth/interval</code> to return a interval to a pitch</p>

```js
['C', 'D', 'E'].map(intervalTo('E')) // => ['3M', '2M', '1P']
```

#### key


<p>Get the key number from a pitch</p>

```js
key(49) // => 'A4'
```

#### letter


<p>Get the letter of a pitch (and optionally move a number of steps)</p>

```js
letter('c#5') // => 'C'
letter('c', 0) // => 'C'
letter('c', 1) // => 'D'
letter('c', 2) // => 'E'
```

#### midi


<p>Get the midi of a pitch</p>

```js
midi('a4') // => 69
```

#### octave


<p>Get the octave of a pitch</p>

```js
octave('a4') // => 4
```

#### pitch


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

#### pitchClass


<p>Get the <a href="https://en.wikipedia.org/wiki/Pitch_class">pitchClass</a> of a pitch</p>

```js
pitchClass('a4') // => 69
```

#### props


<p>Get pitch properties</p>

```js
props('C#2') // => { }
```

#### transpose


<p>Transpose a pitch by an interval</p>

```js
transpose('E', 'M2') // => 'F#4'
transpose('C', 'M-2') // => 'Bb3'
['M2', 'm3', 'P-8'].map(tranapose('C')) // => ['D4', 'Eb4', 'C3']
['C', 'D', 'E'].map(transpose('M2')) // => ['D4', 'E4', 'F#4']
```

## Set module


Number of functions: 6

#### binarySets


<p>Return all possible set binary numbers</p>


#### fromBinary


<p>Convert a binary set number to an intervals collection</p>

```js
intervals('1P 2M') // => ['1P', '2M']
intervals(2773) // => ['1P', '2M', '3M']
```

#### genericSet


<p>Get the intervals of a pitch set</p>

```js
toIntervals()
```

#### modes


<p>Return all modes of a pitch set</p>

```js
modes('C D E') // => [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]]
```

#### pitchSet


<p>Create a pitch class set from a collection of pitches.</p>

```js
pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']
```

#### toBinary


<p>Return the binary set representation of a collection of intervals</p>

```js
toBinary('1P 2M') // => '101000000000'
toBinary('1P 9M') // => '101000000000'
toBinary('1P 7M') // => '100000000001'
toBinary('1P 8P') // => '100000000000'
```

## Scale module


Number of functions: 7

#### generic


<p>Get a generic scale (the intervals) from a scale name without tonic</p>

```js
generic('C major') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
```

#### mode


<p>Get the mode of a scale</p>

```js
mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
```

#### name


<p>Given a scale notes return the scale name (if any)</p>

```js
name('C D E F G A B') // => 'C major'
```

#### names


<p>Get the known scale names</p>

```js
names() => ['major', 'minor', ....]
```

#### parse


<p>Get the components of a scale name</p>

```js
parse('C major') // => { tonic: 'C', type: 'major' }
```

#### scale


<p>Get the scale (pitch set) of a scale name</p>

```js
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('D diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']
```

#### triad


<p>Get a triad from a set starting from the first note, a simplistic implementation.</p>

```js
triad(scale('C major')) // => ['C', 'E', 'G']
triad(scale('C major'), 5) // => ['C', 'E', 'G', 'B', 'D']
```

## Chord module


Number of functions: 6

#### chord


<p>Get chord notes or intervals by its type and (optionally) tonic pitch</p>

```js
chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
chord('7b5') // => ['1P', '3M', '5d', '7m']
chord('7b5', 'Bb2')
```

#### fromScale


<p>Return all the chord names of a given scale</p>


#### intervals


<p>Get the intervals of a chord name</p>

```js
intervals('Cmaj7') // => ['1P', '3M', '5P', '7M']
```

#### name


<p>Get the chord name(s) of a given pitches</p>


#### names




```js
names() => ['major', 'minor', ....]
```

#### parse


<p>Get the components of a chord name</p>

```js
parse('C#Maj7') // => { tonic: 'C#', type: 'Maj7' }
parse('7b5') // => { tonic: null, type: '7b5' }
```

## Interval module


Number of functions: 9

#### add


<p>Add two intervals</p>

```js
add('M2', 'M2') // => 'M3'
```

#### harmonize


<p>Given a collection of intervals, and a tonic create a collection of pitches</p>

```js
harmonize('C2', ['P1 P5']) // => ['C2', 'G2']
```

#### interval


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

#### invert


<p>Get the <a href="https://en.wikipedia.org/wiki/Interval_(music">inversion</a>#Inversion)<br />of an interval.</p>

```js
invert('M9') // => 'M2'
invert('M-10') // => 'M-3'
invert('P-11', true) // => 'P4'
```

#### isInterval


<p>Test if a string is a valid interval</p>

```js
isInterval('blah') // false
isInterval('P5') // true
isInterval('P6') // false
```

#### opposite


<p>Get the opposite of an interval</p>

```js
opposite('M2') // => 'M-2'
opposite('P-8') // => 'P8'
```

#### props


<p>Get interval properties</p>

```js
var props = require('tonal/interval/props')
props('-5P') // => { name: '-5P', quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
props('9m') // => { name: '9m', quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }
```

#### semitones


<p>Get the semitones of a interval</p>

```js
semitones('5P') // => 7
```

#### simplify


<p>Simplify an interval</p>

```js
simplify('9M') // => '2M'
simplify('-9M') // => '-2M'
simplify('-2M', true) // => '2M'
```

## Key module


Number of functions: 7

#### accidentals


<p>Given a key (number) returns the accidentals</p>

```js
accidentals('G major') // => '#'
accidentals('Eb minor') // => 'bbbbbb'
accidentals(3) // => '###'
accidentals(-2) // => 'bb'
```

#### alteredNotes


<p>Given a key, return the altered pitches</p>

```js
alteredNotes('D major') // => ['F#', 'C#']
alteredNotes(3) // => ['F#', 'C#', 'G#']
alteredNotes('bb') // => ['Bb', 'Eb']
```

#### fromPitchSet


<p>Given a pitch set, return its key</p>

```js
fromPitchSet('C Bb F') // => -1
```

#### keyNumber


<p>Get the key number (the number of sharps or flats) of a key</p>

```js
keyNumber('G major') // => 1
keyNumber('F major') // => -1
keyNumber('C') // => 0
keyNumber('Eb minor') // => -6
keyNumber('##') // => 2
keyNumber('bbb') // => -3
```

#### parse


<p>Get the components of a key name</p>

```js
parse('C minor') // => { tonic: 'C', type: 'minor'}
parse('C#') // => { tonic: 'C#', type: 'major'}
```

#### pitchSet


<p>Get the pitch class set from a key.</p>

```js
pitchSet('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
pitchSet('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
```

#### triads


<p>Get the triads of</p>

```js
triads('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
triads('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
```

## Fifths module


Number of functions: 3

#### byFifths


<p>Get a comparator function to sort a collection of pitch classes</p>

```js
['C#', 'G#', 'F#'].sort(byFifths()) // => ['F#', 'C#', 'D#']
```

#### fifths


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

#### transpose


<p>Transpose a pitch class by a number of fifths</p>

```js
transpose('C', 2) // => 'D'
transpose('C5', -2) // => 'Bb'
```
