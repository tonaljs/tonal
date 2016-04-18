# Tonal

__tonal__ is a functional music theory library. It deals with abstract music concepts like picthes and intervals, not actual music.

`tonal` have no dependencies (it weights 6kb minified), but there are other modules that depends on it and extends it's functionality.

Tonal is also the result of my journey of learning how to implement a music theory library in javascript in a functional way. And I've learn a lot.

You are currently reading the source code of the library. It's written in literate programming as a tribute to the [The Haskell School of Music](http://haskell.cs.yale.edu/?post_type=publication&p=112) and it's impressive paper ["From Signals to Symphonies"](http://haskell.cs.yale.edu/wp-content/uploads/2015/03/HSoM.pdf) that has a big influence over tonal development.

This page is generated using the documentation tool [docco](http://jashkenas.github.io/docco/)

## Music Theory for Javascript Programmers

This library is about tonal music. In tonal music we make some assumptions about how music works. That assumptions are only applicable to part of the music (mostly western music) and they are useful in some contexts.

The most important assumption is that music is made up of units sound called __notes__, and each note has some properties: pitch, duration, timbre, loudness.

The __pitch__ is how high the note is, and the difference between the pitch of two notes is called an __interval__. Sometimes people use the word note as synonym for pitch ("i'm playin C# note") but here we'll differentiate between both.

To quantify the pitch relationship between notes we use a pre-stablished reference system. In tonal music our reference is the __semitone__: the minimum interval (distance) between two pitches.

The interval of 12 semitones has a very important function in music, and it's called __octave__.


#### Prelude

Some utility functions:

```js
const isArr = Array.isArray
const isStr = (s) => typeof s === 'string'
```


## 1. Pitches

Tonal uses strings to represent pitches, but that representation is not very practical when comparing or transforming pitches, so we need an _internal numeric representation_ of the pitch.

For the string representation we will use [scienticic pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation) by default. For numeric representation we will use an array with the form `[fifths, octaves]`, what I'll be call here the [array pitch notation](http://www.gregjopa.com/2011/05/calculate-note-frequencies-in-javascript-with-music-js/).

#### Array pitch notation

My first encounter with array notation was in in the excellent javascript theory library [teoria](https://github.com/saebekassebil/teoria) which takes the idea from the discontinued [MusicJS](https://github.com/gregjopa/music.js) theory framework.

A pitch is encoding with an array of the fifths and octaves required to reach the pitch from `C0`. For example, `C0` itself is `[0,0]`. `D0` is `[2, -1]` since two fifths would move to `D1` so we need to down 1 octave.
To reach `E` we need four fifths that spans two octaves, so `E2` its `[4, 0]` and `E0` its `[4, -2]`, and so on.

```js
// The number of fifths required to get C, D, E, F, G, A and B from C
const FIFTHS = [0, 2, 4, -1, 1, 3, 5]
```

There is a nice property of the cycle of fifths that we're going to use to implement accidentals: when moving up 7 fifths to a pitch, we get the same letter with a sharp. Moving down 7 fifths add a flat:

```js
// get the number of fifths for a letter index and alteration
// letter is 0 for C, 1 for D, 2 for E ... and 6 for B
// alt is 0 for unaltered, positive for sharps and negative for flats
const fifths = (letter, alt) => FIFTHS[letter] + 7 * alt
```

To get this notes in different octaves, first we need to know how many octaves spans a number of fifths:

```js
// given a number of fiths, return the octaves they span
const fifthsOcts = (f) => Math.floor(f * 7 / 12)
```

Now we can encode the octaves. Just remember that, for each sharp we need to down 4 octaves and the opposite for flats:

```js
// encode the octaves required for a pitch
function octaves (letter, alt, oct) {
  return oct - fifthsOcts(FIFTHS[letter]) - 4 * alt
}
```

```js
/**
 * Build a pitch from letter index, alteration and octave. If
 * octave is not present, it builds a pitch class.
 *
 * @param {Integer} letter - the letter number (0-based index)
 * @param {Integer} alt - the pitch accidentals integer
 * @param {Integer} oct - the pitch octave
 * @return {Array} the pitch in coord notation
 */
export function pitch (letter, alt, oct) {
  return !oct && oct !== 0 ? [ fifths(letter, alt) ]
    : [ fifths(letter, alt), octaves(letter, alt, oct) ]
}
```

The tonal definition of pitch:

```js
// test if the given object is a pitch in array notation
const isPitchArr = (p) => isArr(p) && (p.length === 2 || p.length === 1)
```

Notice that [teoria]() uses `[octave, fifths]` but we use `[fifths, octave]`. That's because tonal allow pitch classes (pitches without octaves) in the form `[fifths]`:

```js
// test if the given object is a pitch class in array notation
const isPitchClassArr = (p) => isArr(p) && p.length === 1
```

#### Scientific notation

Pitches in scientific notation have three parts: letter, accidentals and an optional octave. Let's use regexp to split components:

```js
var PITCH_REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d{0,1})$/
/**
 * Get the a regex to parse pitch in scientific notation
 *
 * @return {Regex} the regex
 *
 * After exec against a valid string we get:
 * - 0: the complete string
 * - 1: the letter (in upper or lower case)
 * - 2: the alterations (a list of #, b or x)
 * - 3: an optional octave number
 * @example
 * pitchRegex().exec('C#2') // => ['C#2', 'C', '#', '2']
 */
export const pitchRegex = () => PITCH_REGEX
```

Then we'll need a numeric representation of a letter. The __letterIndex__ is a number from 0 to 6 representing letters `C D E F G A B`:

```js
/**
 * Given a pitch letter string, return it's letter index.
 * @param {String} letter - the pitch letter
 * @return {Integer} the letter index
 */
export const letterIndex = (l) => 'CDEFGAB'.indexOf(l.toUpperCase())
```

Within `tonal` _alteration_ is a numeric representation of accidentals. `0` means no accidentals, positive numbers are for sharps and negative numbers for flats (`x` means double sharp):

```js
/**
 * Convert accidental string to alteration number
 * @function
 * @param {String} acc - the accidental string
 * @return {Integer} the alteration number
 * @example
 * accToAlt('#') // => 1
 * accToAlt('bbb') // => -2
 * accToAlt('') // => 0
 * accToAlt('x') // => 2
 */
export function accToAlt (acc) {
  var alt = acc.replace(/x/g, '##').length
  return acc[0] === 'b' ? -alt : alt
}
```

With those tools we can write our __pitchParse__ function:

```js
// parse a string with a pitch in scientific notation
function parseSci (str) {
  var m = PITCH_REGEX.exec(str)
  if (!m) return null
  var li = letterIndex(m[1])
  var alt = accToAlt(m[2])
  var oct = m[3] ? +m[3] : null
  return pitch(li, alt, oct)
}
```

#### Just one optimization

With previous versions of tonal I was too much worried about performance, and I've ended doing lot of micro optimizations that made the code difficult to follow. Now I prefer code clarity and brevity over performance. With one exception.

Since `tonal` is always converting between string notation to array notation, if we cache this process we'll get a big performance gain:

```js
// decorate a parser to cache results
function cache (parser) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return cache[str] || (cache[str] = parser(str))
  }
}
```

Now we can have our optimized __pitchParse__ function:

```js
/**
 * Given a pitch string in scientific notation, get the pitch in array notation
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the pitch in array notation or null if not valid string
 * @example
 * pitchParse('C2') // => [2, 1]
 * pitchParse('bla') // => null
 */
export const pitchParse = cache(parseSci)
```

#### Pitch properties

Now we are going to write a collection of functions to get properties from pitches. Since `tonal` embraces the idea of string representing pitches, it's normal that those functions accepts strings as pitches. But if at the same time they also accepts pitches in array notation, we open the possibility to use a different pitch notation (helmozt, for example) with the same function.

For this purpose we write the `tryPitch` function that parses notes in scientific notation, or returns the unaltered object if parse fails.

```js
// try to parse using a parser or do nothing if parser fails
function tryParser (parser) {
  return (obj) => isStr(obj) ? parser(obj) || obj : obj
}

/**
 * Given an object, try to parse as if it were a pitch in scientific notation. If success, return the parsed pitch, otherwise return the unmodified object.
 *
 * @function
 * @param {Object} obj - the object to parse
 * @return {Array|Object} the parsed pitch or the object if not valid pitch string
 * @example
 * tryPitch('G3') // => [1, 3]
 * tryPitch([1, 3]) // => [1, 3]
 * tryPitch(3) // => 2
 */
export const tryPitch = tryParser(pitchParse)
```

We write a function decorator that tries to parse first argument with `pitchParse` and return the parsed pitch or the unaltered argument. Functions decorated with `prop` accepts pitch is scientific notation or in array notation:

```js
/**
 * Decorate a function with one parameter to accepts
 * pitch in scientific notation
 * @param {Function} fn - the function to decorate
 * @return {Function} a function with one parameter that can be a pitch in scientific notation or anything else.
 */
export const prop = (fn) => (obj) => fn(tryPitch(obj))
```

__pitch alteration__

With this decorator, we write our first property function. Notice that the code is wrapped by the `prop` decorator and it assumes a pitch in array notation:

```js
/**
 * Get alteration of a pitch.
 *
 * The alteration is an integer indicating the number of sharps or flats
 *
 * @name alt
 * @function
 * @param {Array|String} pitch - the pitch (either in scientific notation or array notation)
 * @return {Integer} the alteration
 * @example
 * alt('C#2') // => 2
 */
export const alt = prop((p) => Math.floor((p[0] + 1) / 7))
```

__pitch letter__

The pitch letter is the pitch class without accidentals. Since adding accidentals means adding 7 to fifth number, we perform the opposite using the mod operator:

```js
// remove accidentals to a pitch class
// it gets an array and return a number of fifths
function unaltered (p) {
  var i = (p[0] + 1) % 7
  return i < 0 ? 7 + i : i
}
```

The `letter` function body assumes a pitch in array notation and it's wrapped by the `prop` decorator to convert from scientific to array if necessary:

```js
const LETTERS = 'FCGDAEB'
/**
 * Get the pitch letter. It accepts scientific or array notation.
 *
 * @name letter
 * @function
 * @param {Array|String} pitch - the pitch to get the letter from
 * @return {String} the letter
 * @example
 * letter('C#2') // => 'C'
 * letter([-7, 2]) // => 'C'
 */
export const letter = prop((p) => LETTERS[unaltered(p)])
```

__pitch accidentals__

Before we wrote a function to convert from accidentals to alteration. Now we need the oposite function:

```js
/**
 * Convert alteration number to accidentals
 * @function
 * @param {Integer} alt - the alteration number
 * @return {String} the accidentals string
 * @example
 * altToAcc(2) // => '##'
 * altToAcc(-2) // => 'bb'
 */
export const altToAcc = (alt) => Array(Math.abs(alt) + 1).join(alt < 0 ? 'b' : '#')
```

Write __accidentals__ is now straightforward. Notice that we don't need to wrap this function with `prop` since `alt` is already wrapped:

```js
/**
 * Get accidentals string from a pitch. It accepts pitches in scientific and array notation.
 *
 * @function
 * @param {Array|String} pitch - the pitch to get the accidentals from
 * @return {String} the accidentals string
 * @example
 * accidentals('C##2') // => '##'
 * accidentals([-7]) // => 'b'
 */
export const accidentals = (p) => altToAcc(alt(p))
```

__pitch octave__

To extract the octave property from a pitch, first we need a way to know if it has octave (it's a pitch) or not (it's a pitch class):

```js
// return if pitch has octave or not (is a pitch class)
function hasOct (p) {
  return isArr(p) && typeof p[1] !== 'undefined'
}
```

Then, the `octOr` returns the octave or a default value.

```js
// returns the pitch octave or `v` if not octave present
const octOr = (v) => (p) => hasOct(p) ? p[1] + fifthsOcts(p[0]) : v
```

This allows to write some utility functions:

```js
// return the octave or ''
const octStr = octOr('')
// return the octave or 0
const octNum = octOr(0)
```

And then our `oct` property function:

```js
/**
 * Get the octave from pitch. The pitch can be in array or scientific notation
 * @name oct
 * @function
 * @param {Array|String} pitch - the pitch to get the octave from
 * @return {Integer} the octave or null if it's a pitch class or not a valid pitch
 * @example
 * oct('C#2') // => 2
 * oct('C') // => null
 */
export var oct = prop(octOr(null))
```

#### Convert to pitch array notation to scientific notation

With all this tools, now we can write our `array -> scientific` conversion function:

```js
/**
 * Convert a pitch in array notation to pitch in scientific notation (string)
 *
 * @param {Array} pitch - the pitch to convert
 * @return {String} the pitch in scientific notation
 * @example
 * pitchStr([2, 1]) // => 'D2'
 */
export function pitchStr (p) {
  return letter(p) + accidentals(p) + octStr(p)
}
```

#### Midi pitch numbers

We define _height_ as the distance in semitones from `C0` to the given pitch:

```js
// get pitch height
const height = (p) => p[0] * 7 + 12 * p[1]
```

The midi number can have a value between 1-128:

```js
/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the number to test
 * @return {Boolean} true if it's a valid midi note number
 */
export const isMidi = (m) => !isArr(m) && m > 0 && m < 129
```

To match the general midi specification where `C4` is 60 we must add 12 to that height:

```js
/**
 * Get midi number for a pitch
 * @function
 * @param {Array|String} pitch - the pitch
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi('C4') // => 60
 */
export const midi = prop(function (p) {
  return hasOct(p) ? height(p) + 12
    : isMidi(p) ? +p
    : null
})
```

Since any midi number can be mapped to different pitch names, we should select one arbitrarily:

```js
var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ]
export function fromMidi (num) {
  var midi = +num
  return (isNaN(midi) || midi < 0 || midi > 127) ? null
    : CHROMATIC[midi % 12] + (Math.floor(midi / 12) - 1)
}
```

#### Frequency conversions

The most popular way (in western music) to calculate the frequency of a pitch is using the [well temperament](https://en.wikipedia.org/wiki/Well_temperament) tempered tuning. It assumes the octave to be divided in 12 equally sized semitones and tune all the notes against a reference:

```js
/**
 * Get a frequency calculator function that uses well temperament and a tuning reference.
 * @function
 * @param {Float} ref - the tuning reference
 * @return {Function} the frequency calculator. It accepts a pitch in array or scientific notation and returns the frequency in herzs.
 */
export const wellTempered = (ref) => (pitch) => {
  var m = midi(pitch)
  return m ? Math.pow(2, (m - 69) / 12) * ref : null
}
```

The most popular tuning reference is `A4 = 440Hz`:

```js
/**
 * Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz
 * @function
 * @param {Array|String} pitch - the pitch to get the frequency from
 * @return {Float} the frequency in herzs
 * @example
 * toFreq('C4') // => 261.6255653005986
 */
export const toFreq = wellTempered(440)
```

## 2. Intervals

Imagining each pitch as an interval from `C0` to the given note, then the pitch `D0` means a major second (`2M`), the pitch `E0` means a major thirth (`3M`) and the pitch `Eb0` can represent a minor thirth (`3m`). As a difference with pitches, intervals has a direction: can be ascending or descending.

We going to encode an interval as a pitch with direction `[fifths, octaves, direction]` where direction is `1` to ascending and `-1` to descending intervals. Notice that the first parameter of `interval` is not the interval number but the simplified interval number in 0 based index (the equivalent of letter index, here called _simplified index_):

```js
/**
 * Create an interval from interval simplified number, interval alteration, interval octave and direction
 *
 * @param {Integer} sim - the simplified interval number 0-based index
 * @param {Integer} alteration - the interval alteration
 * @param {Integer} oct - how many octaves the interval spans
 * @param {Integer} dir - the direction (1 ascending, -1 descending)
 * @return {Array} an interval in array notation
 */
export function interval (sim, alt, oct, dir) {
  return pitch(sim, alt, oct).concat(dir)
}
```

And our definition of interval:

```js
/**
 * Return if the given object is an interval
 * @function
 * @param {Object} obj - the object to check
 * @return {Boolean} true if the object is an interval object
 * @example
 * isInterval([0,3,1]) // => true
 */
export const isInterval = (i) => isArr(i) && i.length === 3
```

#### Parse intervals

Parsing intervals is more complicated. First we need to get the simplified index from the interval number. This concept is equivalent to the letter class where each interval number (with independence of the quality) has a simplified index:

```js
// get a simplified index from an interval number. Basically:
// unison is 0, second is 1, thirth is 2, ...
export const simplifiedIndex = (n) => (n - 1) % 7
```

Intervals can be `perfectables` (can have perfect quality: unisons, fourths and fifths) or `majorable` (can have major quality: seconds, thirds, sixths and sevenths):

```js
// To get the type: TYPES[simplifiedIndex]
var TYPES = 'PMMPPMM'
```

The we need to get the alteration number from the quality string. Since some qualities are only valid for some kind of intervals, to parse we need to know the type:

```js
/**
 * Get an alteration number from an interval quality string.
 * It accepts the standard `dmMPA` but also sharps and flats.
 *
 * @param {String} type - the interval type ('P' or 'M')
 * @param {String} quality - the quality string
 * @return {Integer} the interval alteration
 * @example
 * qualityToAlt('M', 'm') // => -1 (for majorables, 'm' is -1)
 * qualityToAlt('P', 'A') // => 1 (for perfectables, 'A' means 1)
 * qualityToAlt('M', 'P') // => null (majorables can't be perfect)
 */
export function qualityToAlt (type, q) {
  if (type === 'P') {
    if (q === 'P') return 0
    else if (q[0] === 'A') return q.length
    else if (q[0] === 'd') return -q.length
  } else if (type === 'M') {
    if (q === 'M') return 0
    else if (q === 'm') return -1
    else if (q[0] === 'A') return q.length
    else if (q[0] === 'd') return -(q.length + 1)
  }
  return null
}
```

Then we build our regex. We want to accept tonal shorthand notation (where number is before the quality: `3M`) and standard shorthand notation (quality before number: `M3`). We prefer the first notation because it's unambiguous (the string `A4` can be interpreted as a pitch or as a interval in shorthand notation):

```js
// shorthand tonal notation (with quality after number)
var IVL_TNL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4})'
// standard shorthand notation (with quality before number)
var IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + IVL_TNL + ')|(' + IVL_STR + '))'
var IVL_REGEX = new RegExp('^' + COMPOSE + '$')

/**
 * Get regex to parse intervals in shorthand notation
 * @return {Regex} the regex
 *
 * After executing the regex, we will have an array-like object with:
 * - 0: the complete string
 */
export function ivlRegex () { return IVL_REGEX }
```

And our interval parse function:

```js
/**
 * Parse a string with an interval in shorthand notation. It support two types: standard shorthand interval notation `quality+[direction]+number` or the tonal shorthand notation `[direction]+number+quality`
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the interval in array notation or null if not valid interval string
 * @example
 * ivlParse('3M') // => [ 4, -2, 1 ]
 * ivlParse('-3M') // => [ 4, -2, -1 ]
 * ivlParse('M3') // => [ 4, -2, 1 ]
 * ivlParse('M-3') // => [ 4, -2, -1 ]
 */
export const ivlParse = cache(function (str) {
  var m = IVL_REGEX.exec(str)
  if (!m) return null
  var num = +(m[3] || m[8])
  var sim = simplifiedIndex(num)
  var alt = qualityToAlt(TYPES[sim], m[4] || m[6])
  var oct = Math.floor((num - 1) / 7)
  var dir = (m[2] || m[7]) === '-' ? -1 : 1
  return interval(sim, alt, oct, dir)
})
```

#### Interval properties

We do the same trick as before, define an `ivlProp` function:

```js
const tryIvl = tryParser(ivlParse)
/**
 * Decorate a function to accept intervals in array of shorthand notation. It only works with 1-parameter functions.
 *
 * @param {Function} fn - the function to be decorated
 * @return {Function} the decorated function
 */
export const ivlProp = (fn) => (obj) => fn(tryIvl(obj))
```

__interval number__

The _interval simple number_ is the interval number (0-index based) as if the interval spawn less than one octave. It's the equivalent of a pitch letter:

```js
// the simplified number against the number of fifths
var SIMPLES = [3, 0, 4, 1, 5, 2, 6]
/**
 * Get the simplified interval number (in 1-based index)
 *
 * @function
 * @param {Array|String} ivl - the interval to get the number from
 * @return {Integer} the simplified interval number
 */
export const simpleNum = ivlProp((i) => SIMPLES[unaltered(i)])
```

The interval number is the simple number in 1-based index with the octave:

```js
/**
 * Get the interval number
 * @function
 * @param {Array|String} ivl - the interval to get the number from
 * @return {Integer} a integer greater than 0 or null if not valid interval
 * @example
 * number('P8') // => 8
 */
export const number = ivlProp((i) => simpleNum(i) + 1 + 7 * octNum(i))
```

__interval quality and type__

Intervals can be _perfectables_ (unison, octaves, fourths, and fifths) or _majorables_ (seconds, thirds, sixths and sevenths):

```js
/**
 * Get the interval type
 * @function
 * @param {Array|String} ivl - the interval
 * @param {String} 'P' if it's perfectable, 'M' if it's majorable
 */
export const ivlType = (i) => TYPES[simpleNum(i)]
```

Using that information we can get the interval quality:

```js
var ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA']
}
/**
 * Get interval quality
 * @function
 * @param {Array|String} ivl - the interval
 * @return {String} the quality string
 * @example
 * quality('3M') // => 'M'
 */
export const quality = ivlProp((i) => ALTER[ivlType(i)][4 + alt(i)])
```

__interval direction__

```js
/*
 * get interval direction
 * @function
 * @param {Array|String} ivl - the interval
 * @return {Integer}
 */
export const direction = (i) => { return i[4] }
const dirStr = (p) => direction(p) === -1 ? '-' : ''
```

#### Convert intervals to strings

Finally, we have the puzzle:

```js
/**
 * Convert an interval in array notation to shorthand notation
 * @function
 * @param {Array} ivl - the interval in array notation
 * @return {String} the interval in shorthand notation
 */
export function ivlStr (p) {
  return dirStr(p) + number(p) + quality(p)
}
```

## 3. Distances

Array notation shines when performing pitch transformations related to distances. Transpose or find interval between pitches are implemented simply by adding or subtracting the arrays as if they were vector values.

#### Transposition

For example, transpose a pitch by an interval is just adding the pitch arrays to the interval array. Notice that if the pitch its a pitch class it returns a pitch class:

```js
// transpose a note by an interval
function trBy (ivl, p) {
  // is a pitch class
  return p.length === 1
    // build a pitch class
    ? [ivl[2] * ivl[0] + p[0]]
    // build a pitch
    : [ivl[2] * ivl[0] + p[0], ivl[2] * ivl[1] + p[1]]
}
```

But we want our transpose function more flexible. First of all, it should receive an interval and a pitch, but the order should not matter:

```js
// parse a pitch or an interval or return the object itself
const pitchOrIvl = (o) => pitchParse(o) || ivlParse(o) || o
```

Second, it should be currified to allow partial application. Partial application allow write code like: `['C', 'D', 'E'].map(transpose('3M'))` and that's the core of this library:

```js
/**
 * Transpose a pitch by an interval
 * This function is currified, and aliased as `tr`
 * @function
 * @param {Array|String} a - the pitch or interval
 * @param {Array|String} b - the pitch or interval
 * @return {String} the pitch transposed by the interval
 * @example
 * transpose('C2', 'm3') // => 'Eb2'
 * transpose('C', '6m') // => 'Ab'
 */
export function transpose (a, b) {
  // if only one argument, partial application
  if (arguments.length === 1) return (b) => transpose(a, b)
  var ac = pitchOrIvl(a)
  var bc = pitchOrIvl(b)
  // if its an interval and a pitch
  var n = (isInterval(ac) && isPitchArr(bc)) ? trBy(ac, bc)
    // it its a pitch and an interval
    : (isPitchArr(ac) && isInterval(bc)) ? trBy(bc, ac)
    // anything else is not valid
    : null
  // convert back to a pitch string
  return n ? pitchStr(n) : null
}
```

I think this is tonal more important function, so it's aliased:

```js
/**
 * An alias for `transpose`
 * @function
 */
export const tr = transpose
```

#### Find intervals between pitches



## Work with collections

Since `tonal` is string oriented, it would be nice to __represent list as strings__:

```js
// items can be separated by spaces, bars and commas
var SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
export function split (source) {
  return isArr(source) ? source
    : typeof source === 'string' ? source.trim().split(SEP)
    : (source === null || typeof source === 'undefined') ? []
    : [ source ]
}
```

#### Map collections

With the above function we can map collection easily: `split('C D E F G').map(transpose('3M'))`.

We will write a __map__ helper function that do more or less the same:

```js
export function map (fn, list) {
  if (arguments.length === 1) return function (l) { return map(fn, l) }
  return split(list).map(fn)
}
```

But it have two gems inside:

- The function is currified. In fact, most of the functions in tonal are [currified](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch4.html)
- The parameters are arranged to make it convenient for currying. The data to be operated on is supplied last (so instead of `map(list, fn)` we will write `map(fn, list)`)

Both things are related and they are in the heart of tonal library. Javascript programmers will find awkward, at the beginning, to have the array as last argument of `map` function, but now you can write:

```
// notice this is only an example, not part of the library
var letters = map(letter);
letters('c2 eb4 g7') // => ['C', 'Eb', 'G']
```

#### Some helpers

```js
export function harmonize (list, tonic) {
  return split(list).map(tr(tonic))
}
```

Fin.
