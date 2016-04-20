# tonal

__tonal__ is a functional music theory library. It deals with abstract music concepts like picthes and intervals, not actual music.

`tonal` have no dependencies (it weights 6kb minified), but there are other modules that depends on it and extends it's functionality.

`tonal` is also the result of my journey of learning how to implement a music theory library in javascript in a functional way. And it's been a long journey.

You are currently reading the source code of the library. It's written in [literate programming](https://en.wikipedia.org/wiki/Literate_programming) as a tribute to the The Haskell School of Music and it's impressive book/source code ["From Signals to Symphonies"](http://haskell.cs.yale.edu/wp-content/uploads/2015/03/HSoM.pdf) that has a big influence over tonal development.

This page is generated using the documentation tool [docco](http://jashkenas.github.io/docco/)

## Music Theory for Javascript Programmers

_This is a music theory crash-course. The minimum to understand what this source code is about. It's main purpose it's to be short, so probably contain lot of inexactitudes. Of course, pull request are welcomed._

This library is about tonal music (when talking about the library, `tonal` will appear with monospace font). In tonal music we make some assumptions about how music works. That assumptions are only applicable to part of the music (mostly western music) and they are useful in some contexts. Yes, sufji music doesn't fit in this theory and probably doesn't need to.

The most important assumption is that music is made up of units sound called __notes__, and each note has some properties: pitch, duration, timbre, loudness.

Sometimes we can use the words _note_ and _pitch_ interchangeably. For example "i'm playin C# note", because you can't play a pitch if it's not as a property of a note, but here we'll [differentiate between both](http://music.stackexchange.com/questions/3262/what-are-the-differences-between-tone-note-and-pitch) most of the time.

The __pitch__ is how high the note is, and the difference between the pitch of two notes is called an __interval__.

`tonal` library focuses mostly on pitches and intervals: create, compare and transform pitches is it's main purpose.

In tonal music there's a special interval called __octave__ that has a very important function in music. Two pitches are separated by one octave when the frequency of the higher is the double of the lower. To the ears, they sound very similar, even if played together they are hard to distinguish. When we name them, they have very similar names, like `C1` and `C2`.

In tonal music we divide the __octave__ in 12 equal parts (this is not always true, but it work for now). The distance of octave divided by 12 is called a __semitone__ and it's the minimum distance between pitches. All the notes inside an octave is called __chromatic scale__. Here's one example: C3, Db3, D3, Eb3, E3, F3, F#3, G3, Ab3, A3, Bb3, B3.

_(Talk about note names, octaves and pitch classes)_

The hardest part to understand is that in tonal music we __name__ pitches in terms of a subset of the chromatic scale. Instead of givin a name to all the pitches of a chromatic scale, we only give a name to a few ('C D E F G A B') and name the rest in relation to one of it. For example, the hole between 'C3' and 'D3' (as you see in previous chromatic scale, there's a pitch between them) can be called 'C#3' (C-sharp 3, 'C3' plus 1 semitone) or 'Db3' (D-flat 3, 'D3' less 1 semitone). Yes, you read right: the same pitch can have different names. When this happen, they are called __enharmonics__.

The names with sharps `#` or flats `b` within them are called __altered__.
If you look at a piano keyboard, the white keys corresponds with unaltered pitches while black keys are the altered ones.

### Prelude

```js
const isArr = Array.isArray
const isNum = (n) => typeof n === 'number'
const isDef = (o) => typeof o !== 'undefined'
```

## 1. Pitches

One of the goal of tonal is to represent pitches as strings, so you can write code like: `transpose('c#2 e3 g4', '3P')`. While this is convenient to the user of the library has two big problems.

First, strings are very unpractical format when comparing or transforming pitches. Second, there are several pitch names system and implement is not viable, and support only one is too poor.

To solve this problems, tonal uses a internal numeric format to represent pitches that makes easier the task of compare or transform them. Second, all functions parameters that accepts pitches as strings also accepts them as numerical format, so you can create your own parser.

#### Fifts/octaves encoding

```js
// map from letter step to number of fifths and octaves
const FIFTHS = [0, 2, 4, -1, 1, 3, 5]
```

```js
// given a number of fiths, return the octaves they span
const fifthsOcts = (f) => Math.floor(f * 7 / 12)
const OCTS = FIFTHS.map(fifthsOcts)
```

```js
export function pitch (step, alt, o) {
  const ffs = FIFTHS[step] + 7 * alt
  if (!isNum(o)) return { ffs }
  oct = o - OCTS[step] - 4 * alt
  return { ffs, oct }
}
```

```js
export const isPitch  = (p) => p && isNum(p.ffs)
export const hasOct = (p) => isPitch(p) && isNum(p.oct)
```

#### Scientific notation

```js
const PITCH_REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d{0,1})$/
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

Then we'll need a numeric representation of a letter. The __step__ is a number from 0 to 6 representing letters `C D E F G A B`:

```js
const LETTERS = 'CDEFGAB'
/**
 * Given a pitch letter string, return it's letter index.
 * @function
 * @param {String} letter - the pitch letter
 * @return {Integer} the letter index
 */
export const letterStep = (l) => LETTERS.indexOf(l.toUpperCase())
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
  const alt = acc.replace(/x/g, '##').length
  return acc[0] === 'b' ? -alt : alt
}
```

With those tools we can write our __pitchParse__ function:

```js
// parse a string with a pitch in scientific notation (SN)
function parseName (str) {
  const m = PITCH_REGEX.exec(str)
  if (!m) return null
  const s = letterStep(m[1])
  const a = accToAlt(m[2])
  const o = m[3] ? +m[3] : null
  return pitch(s, a, o)
}
```

#### Just one optimization

With previous versions of tonal I was too much worried about performance, and I've ended doing lot of micro optimizations that made the code difficult to follow. Now I prefer code clarity and brevity over performance. With one exception.

Since `tonal` is always converting between string notation to Fifths/octave notation, if we cache this process we'll get a big performance gain:

```js
// decorate a parser to cache results
function cache (parser) {
  const cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return cache[str] || (cache[str] = parser(str))
  }
}
```

Now we can have our optimized __pitchParse__ function:

```js
/**
 * Given a pitch string in scientific notation, get the pitch in Fifths/octave notation
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the pitch in Fifths/octave notation or null if not valid string
 * @example
 * pitchParse('C2') // => [2, 1]
 * pitchParse('bla') // => null
 */
export const pitchParse = cache(parseName)
```

#### Two notations

```js
const notePitch = (p) => isPitch(p) ? p : pitchParse(p)
const prop = (fn) => (p) => fn(notePitch(p))
```

#### Pitch properties

__pitch step__

```js
// remove accidentals to a pitch class
// it gets an array and return a number of fifths
function unaltered (p) {
  const i = (p.ffs + 1) % 7
  return i < 0 ? 7 + i : i
}
// 'FCGDAEB' steps numbers
var STEPS = [3, 0, 4, 1, 5, 2, 6]
export const step = prop((p) => isPitch(p) ? STEPS[unaltered(p)] : null)
```


__pitch letter__

The pitch letter is the pitch class without accidentals. Since adding accidentals means adding 7 to fifth number, we perform the opposite using the mod operator:

```js
```

The `letter` function body assumes a pitch in Fifths/octave notation and it's wrapped by the `prop` decorator to convert from scientific to array if necessary:

```js
/**
 * Get the pitch letter. It accepts scientific or Fifths/octave notation.
 *
 * @name letter
 * @function
 * @param {Pitch|String} pitch - the pitch to get the letter from
 * @return {String} the letter
 * @example
 * letter('C#2') // => 'C'
 * letter([-7, 2]) // => 'C'
 */
export const letter = prop((p) => LETTERS[step(p)])
```

__pitch alteration__

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
export const alt = prop((p) => Math.floor((p.ffs + 1) / 7))
```

__pitch accidentals__

Before we wrote a function to convert from accidentals to alteration. Now we need the oposite function:

```js
const fillStr = (n, l) => Array(Math.abs(n) + 1).join(l)

/**
 * Convert alteration number to accidentals
 * @function
 * @param {Integer} alt - the alteration number
 * @return {String} the accidentals string
 * @example
 * altToAcc(2) // => '##'
 * altToAcc(-2) // => 'bb'
 */
export const altToAcc = (alt) => fillStr(alt, alt < 0 ? 'b' : '#')
```

Write __accidentals__ is now straightforward. Notice that we don't need to wrap this function with `prop` since `alt` is already wrapped:

```js
/**
 * Get accidentals string from a pitch. It accepts pitches in scientific and Fifths/octave notation.
 *
 * @function
 * @param {Pitch|String} pitch - the pitch to get the accidentals from
 * @return {String} the accidentals string
 * @example
 * accidentals('C##2') // => '##'
 * accidentals([-7]) // => 'b'
 */
export const accidentals = (p) => altToAcc(alt(p))
```

__pitch octave__

To calc the real octave from encoded octave, just inverse the formula:

```js
const calcOct = (p) => p.oct + 4 * alt(p) + OCTS[step(p)]
// returns the pitch octave or `v` if not octave present
const octOr = (v) => (p) => hasOct(p) ? calcOct(p) : v
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
 * @param {Pitch|String} pitch - the pitch to get the octave from
 * @return {Integer} the octave or null if it's a pitch class or not a valid pitch
 * @example
 * oct('C#2') // => 2
 * oct('C') // => null
 */
export const oct = prop(octOr(null))
```

#### Convert to pitch Fifths/octave notation to scientific notation

With all this tools, now we can write our `array -> scientific` conversion function:

```js
/**
 * Convert a pitch in Fifths/octave notation to pitch in scientific notation (string)
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
const height = (p) => p.ffs * 7 + 12 * p.oct
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
export const midi = function (val) {
  var p = notePitch(val)
  return hasOct(p) ? height(p) + 12
    : isMidi(val) ? +val
    : null
}
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


###

## 2. Intervals

Imagining each pitch as an interval from `C0` to the given note, then the pitch `D0` means a major second (`2M`), the pitch `E0` means a major thirth (`3M`) and the pitch `Eb0` can represent a minor thirth (`3m`). In fact, we are encoding pitches as intervals. This is another nice property of fifths/oct notation: can be used to represent pitches and intervals with same API.

The only difference to pitches is that intervals has a direction: can be ascending or descending. We going to encode an interval as a pitch with direction where `1` represent ascending and `-1` descending intervals.

Notice that the first parameter of `interval` is not the interval number but the simplified interval number in 0 based index (the equivalent of pitch step, called here __interval step__)

```js
/**
 * Create an interval from interval step, interval alteration, interval octave and direction
 *
 * @param {Integer} step - the interval step (0 = unison, 1 = second ... 6 = seventh)
 * @param {Integer} alteration - the interval alteration
 * @param {Integer} oct - how many octaves the interval spans
 * @param {Integer} dir - the direction (1 ascending, -1 descending)
 * @return {Array} an interval in Fifths/octave notation
 */
export function interval (step, alt, oct, dir) {
  const p = pitch(step, alt, oct)
  return { ffs: p.ffs, oct: p.oct, dir: dir}
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
export const isInterval = (i) => hasOct(i) && isDef(i.dir)
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
const TYPES = 'PMMPPMM'
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
const IVL_TNL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4})'
// standard shorthand notation (with quality before number)
const IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
const COMPOSE = '(?:(' + IVL_TNL + ')|(' + IVL_STR + '))'
const IVL_REGEX = new RegExp('^' + COMPOSE + '$')

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
 * @return {Array} the interval in Fifths/octave notation or null if not valid interval string
 * @example
 * ivlParse('3M') // => [ 4, -2, 1 ]
 * ivlParse('-3M') // => [ 4, -2, -1 ]
 * ivlParse('M3') // => [ 4, -2, 1 ]
 * ivlParse('M-3') // => [ 4, -2, -1 ]
 */
export const ivlParse = cache(function (str) {
  const m = IVL_REGEX.exec(str)
  if (!m) return null
  const num = +(m[3] || m[8])
  const sim = simplifiedIndex(num)
  const alt = qualityToAlt(TYPES[sim], m[4] || m[6])
  const oct = Math.floor((num - 1) / 7)
  const dir = (m[2] || m[7]) === '-' ? -1 : 1
  return interval(sim, alt, oct, dir)
})
```

#### Interval properties

We do the same trick as before, define an `ivlProp` function:

```js
const ivlPitch = (i) => isInterval(i) ? i : ivlParse(i)
/**
 * Decorate a function to accept intervals in array of shorthand notation. It only works with 1-parameter functions.
 *
 * @param {Function} fn - the function to be decorated
 * @return {Function} the decorated function
 */
export const ivlProp = (fn) => (obj) => fn(ivlPitch(obj))
```

__interval number__

The _interval simple number_ is the interval number (0-index based) as if the interval spawn less than one octave. It's the equivalent of a pitch letter:

```js
// the simplified number against the number of fifths
const SIMPLES = [3, 0, 4, 1, 5, 2, 6]
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
const ALTER = {
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
 * Convert an interval in Fifths/octave notation to shorthand notation
 * @function
 * @param {Array} ivl - the interval in Fifths/octave notation
 * @return {String} the interval in shorthand notation
 */
export function ivlStr (p) {
  return dirStr(p) + number(p) + quality(p)
}
```

## 3. Distances

Fifths/octave notation shines when performing pitch transformations related to distances. Transpose or find interval between pitches are implemented simply by adding or subtracting the arrays as if they were vector values.

#### Transposition

For example, transpose a pitch by an interval is just adding the pitch arrays to the interval array. Notice that if the pitch its a pitch class it returns a pitch class:

```js
// transpose a note by an interval
function trBy (ivl, p) {
  // is a pitch class
  return hasOct(p)
    // build a pitch
    ? { ffs: ivl.dir * ivl.ffs + p.ffs, oct: ivl.dir * ivl.oct + p.oct }
    // build a pitch class
    : { ffs: ivl.dir * ivl.ffs + p.ffs }
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
  const ac = pitchOrIvl(a)
  const bc = pitchOrIvl(b)
  // if its an interval and a pitch
  const n = (isInterval(ac) && isPitch(bc)) ? trBy(ac, bc)
    // it its a pitch and an interval
    : (isPitch(ac) && isInterval(bc)) ? trBy(bc, ac)
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

## 4. Collections

Since `tonal` is string oriented, it would be nice to __represent list as strings__:

```js
// items can be separated by spaces, bars and commas
const SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
export function split (src) {
  return isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
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
const letters = map(letter);
letters('c2 eb4 g7') // => ['C', 'Eb', 'G']
```

#### Some helpers

```js
export function harmonize (list, tonic) {
  return split(list).map(tr(tonic))
}
```

Fin.
