# tonal

__tonal__ is a functional music theory library. It deals with abstract music concepts like picthes and intervals, not actual music.

`tonal` have no dependencies (it weights 6kb minified), but there are other modules that depends on it and extends it's functionality.

`tonal` is also the result of my journey of learning how to implement a music theory library in javascript in a functional way. And it's been a long journey.

You are currently reading the source code of the library. It's written in [literate programming](https://en.wikipedia.org/wiki/Literate_programming) as a tribute to the The Haskell School of Music and it's impressive book/source code ["From Signals to Symphonies"](http://haskell.cs.yale.edu/wp-content/uploads/2015/03/HSoM.pdf) that has a big influence over tonal development.

This page is generated using the documentation tool [docco](http://jashkenas.github.io/docco/)

## Music Theory for Javascript Programmers

_This is a music theory crash-course. The minimum to understand what this source is about. It's main purpose it's to be short, so probably contain lot of inexactitudes. Of course, pull request are welcomed._

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

We'll see lot of arrays:

```js
const isArr = Array.isArray
```

## 1. Pitches

### Multiple notations

One of the goal of tonal is to represent pitches as strings, so you can write code like: `transpose('c#2 e3 g4', '3P')`. I wanted to support the standard notation, but keep open to other implementations. The solution was support a simple numeric notation (the array notation) and decorate function arguments to support string notations.

To change the notation you can wrap any function to convert between the new notation and array notation, and keep using the same functions.

### Array notation

```js
export const pitch = (s, a, o) => o || o === 0 ? [s, a, o] : [s, a]
```

```js
const hasOct = (p) => isArr(p) && typeof p[2] !== 'undefined'
```

### Scientific

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
const STEPS = 'CDEFGAB'
/**
 * Given a pitch letter string, return it's letter index.
 * @param {String} letter - the pitch letter
 * @return {Integer} the letter index
 */
export const step = (l) => STEPS.indexOf(l.toUpperCase())
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
// parse a string with a pitch in scientific notation (SN)
function parsePSN (str) {
  var m = PITCH_REGEX.exec(str)
  if (!m) return null
  var l = step(m[1])
  var a = accToAlt(m[2])
  var o = m[3] ? +m[3] : null
  return pitch(l, a, o)
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
export const pitchParse = cache(parsePSN)
```

#### Two notations

```js
const pitchArr = (p) => isArr(p) ? p : pitchParse(p)
const prop = (fn) => (p) => fn(pitchArr(p))
```

#### Pitch properties

__pitch letter__

```js
export const letter = prop((p) => STEPS[p[0]])
```


__pitch alteration and accidentals__

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
export const alt = prop((p) => p[1])
```

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

```js
export const accidentals = (p) => altToAcc(alt(p))
```

__pitch octave__

```js
const octOr = (d) => (p) => hasOct(p) ? p[2] : d
const octStr = octOr('')
const octNum = octOr(0)
export const oct = prop(octOr(null))
```

### Pitch to scientific

```js
export const pitchStr = (p) => letter(p) + accidentals(p) + octStr(p)
```

#### Midi pitch numbers

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

```js
const HEIGHTS = [0, 2, 4, 5, 7, 9, 11]
export const chroma = prop((p) => HEIGHTS[p[0]] + p[1])
export const height = prop((p) => chroma(p) + 12 * octNum(p))
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
export const midi = function (p) {
  var a = pitchArr(p)
  return hasOct(a) ? height(a) + 12
    : isMidi(p) ? +p
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

# 2. Intervals

```js
const ivl = (s, a, o, d) => [s, a, o, d]
```

#### Parse intervals

Parsing intervals is more complicated. First we need to get the simplified index from the interval number. This concept is equivalent to the letter class where each interval number (with independence of the quality) has a simplified index:

```js
// get a simplified index from an interval number. Basically:
// unison is 0, second is 1, thirth is 2, ...
export const ivlStep = (n) => (n - 1) % 7
```

Intervals can be `perfectables` (can have perfect quality: unisons, fourths and fifths) or `majorable` (can have major quality: seconds, thirds, sixths and sevenths):

```js
// Interval steps is the index of the letter types
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
 * qToAlt('M', 'm') // => -1 (for majorables, 'm' is -1)
 * qToAlt('P', 'A') // => 1 (for perfectables, 'A' means 1)
 * qToAlt('M', 'P') // => null (majorables can't be perfect)
 */
export function qToAlt (type, q) {
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
  var step = ivlStep(num)
  var alt = qToAlt(TYPES[step], m[4] || m[6])
  var oct = Math.floor((num - 1) / 7)
  var dir = (m[2] || m[7]) === '-' ? -1 : 1
  return ivl(step, alt, oct, dir)
})
```

### Interval properties

__interval number__

```js
export const number = (i) => i[0] + 1 + 7 * octNum(i[2])
```

__interval type__

Intervals can be _perfectables_ (unison, octaves, fourths, and fifths) or _majorables_ (seconds, thirds, sixths and sevenths):

```js
/**
 * Get the interval type
 * @function
 * @param {Array|String} ivl - the interval
 * @param {String} 'P' if it's perfectable, 'M' if it's majorable
 */
export const ivlType = (i) => TYPES[i[0]]
```

__interval quality__


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
export const quality = (i) => ALTER[ivlType(i)][4 + alt(i)]
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
export const ivlStr = (p) => dirStr(p) + number(p) + quality(p)
```

## 3. Distances

#### Pitch coordinates

Pitch coordinates hines when performing pitch transformations related to distances. Transpose or find interval between pitches are implemented simply by adding or subtracting the arrays as if they were vector values.

```js
// map from pitch number to number of fifths and octaves
var BASES = [ [0, 0], [2, -1], [4, -2], [-1, 1], [1, 0], [3, -1], [5, -2] ]

function toCoord (step, alt, oct, dir) {
  var base = BASES[step]
  var f = base[0] + 7 * alt
  if (!oct && oct !== 0) return [f]
  var o = oct + base[1] - 4 * alt
  if (!dir) return [f, o]
  else return [f, o, dir]
}
export const coord = (p) => p ? toCoord.apply(null, p) : null
```

```js
// fifths mapped to pitch classes
var PCS = [[3, 1], [0, 0], [4, 0], [1, -1], [5, -1], [2, -2], [6, -2], [3, -3]]
PCS_OCT = [1, 0, 0, -1, -1, -2, -2, -3]

function toArray (f, o, d) {
  var index = (f + 1) % 7
  var pc = PCS[index < 0 ? 7 + index : index]
  var step = pc[0]
  var alt = Math.floor((f + 1) / 7)
  if (!o && o !== 0) return [step, alt]
  var oct = o - pc[1] + alt * 4
  return !d ? [step, alt, oct] : [step, alt, oct, d]
}
export const coordArr = (c) => c ? toArray.apply(null, c) : null
```

#### Transposition

```js
const add = (a, b) => {
  switch (Math.min(a.length, b.length)) {
    case 1: return [a[0] + b[0]]
    case 2: return [a[0] + b[0], a[1] + b[1]]
    case 3: return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
    case 4: return [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]]
    default: []
  }
}
```

```js
function trBy (i, p) {
  if (!isArr(i) || !isArr(p)) return null
  return pitchStr(coordArr(add(coord(i), coord(p))))
}

export function transpose (a, b) {
  if (arguments.length === 1) return (c) => transpose(a, c)
  return trBy(ivlParse(a) || a, pitchParse(b) || b) ||
    trBy(ivlParse(b) || b, pitchParse(a) || a)
}
export const tr = transpose
```

## 4. Collections

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
