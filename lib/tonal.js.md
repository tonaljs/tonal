# Tonal

#### Prelude

```js
const note = require('note-parser')
const ivl = require('interval-notation')
```

```js
const isArr = Array.isArray
const isNum = (n) => typeof n === 'number'
```

## 1. Pitches

#### Pitch encoding

```js
// map from letter step to number of fifths and octaves
const FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// encode a pitch class using the step number and alteration
const encPC = (step, alt) => FIFTHS[step] + 7 * alt
```

```js
// given a number of fifths, return the octaves they span
const fifthsSpan = (f) => Math.floor(f * 7 / 12)
// get the number of octaves it span each step
const FIFTH_OCTS = FIFTHS.map(fifthsSpan)
const encOct = (step, alt, oct) => oct - FIFTH_OCTS[step] - 4 * alt
```

```js
export function pitch (step, alt, oct, dir) {
  // is valid step?
  if (step < 0 || step > 6) return null
  const pc = encPC(step, alt || 0)
  // if not octave, return the pitch class
  if (!isNum(oct)) return [ pc ]
  const o = encOct(step, alt, oct)
  if (!isNum(dir)) return [ pc, o ]
  const d = dir < 0 ? -1 : 1
  return [ d * pc , d * o, d ]
}
```

```js
export const isPitch = (p) => isArr(p) && isNum(p[0])
export const isPitchClass = (p) => isArr(p) && p.length === 1
export const hasOct = (p) => isPitch(p) && isNum(p[1])
export const isPitchNote = (p) => hasOct(p) && p.length === 2
export const isInterval = (i) => hasOct(i) && isNum(i[2])
```

### Pitch decoding

```js
// remove accidentals to a pitch class
// it gets an array and return a number of fifths
function unaltered (f) {
  const i = (f + 1) % 7
  return i < 0 ? 7 + i : i
}
```

```js
const decodeStep = (f) => STEPS[unaltered(f)]
const decodeAlt = (f) => Math.floor((f + 1) / 7)
// 'FCGDAEB' steps numbers
const STEPS = [3, 0, 4, 1, 5, 2, 6]
function decode (p) {
  const s = decodeStep(p[0])
  const a = decodeAlt(p[0])
  const o = isNum(p[1]) ? p[1] + 4 * a + FIFTH_OCTS[s] : null
  return { step: s, alt: a, oct: o, dir: p[2] || null }
}
```

#### Pitch parsers

Convert from string to pitches is a quite expensive operation that it's executed a lot of times. Some caching will help:

```js
const cache = {}
const cached = (parser) => (str) => {
  if (typeof str !== 'string') return null
  return cache[str] || (cache[str] = parser(str))
}
```

```js
export const parseNote = cached((str) => {
  const n = note.parse(str)
  return n ? pitch(n.step, n.alt, n.oct) : null
})
```

```js
export const parseIvl = cached((str) => {
  const i = ivl.parse(str)
  return i ? pitch(i.simple - 1, i.alt, i.oct, i.dir) : null
})
```

```js
const parsePitch = (str) => parseNote(str) || parseIvl(str)
```

### Pitch to string

```js
const stepLetter = (s) => 'CDEFGAB'[s]
const fillStr = (s, num) => Array(Math.abs(num) + 1).join(s)
const altAcc = (n) => fillStr(n < 0 ? 'b' : '#', n)
const strNum = (n) => n !== null ? n : ''
export function strNote (pitch) {
  const p = !isInterval(pitch) ? decode(pitch) : null
  return p ? stepLetter(p.step) + altAcc(p.alt) + strNum(p.oct) : null
}
```

```js
const isAsc = (p) => p.dir === 1
const isPerf = (p) => ivl.type(p.step + 1) === 'P'
const calcNum = (p) => isAsc(p) ? p.step + 1 + 7 * p.oct : (8 - p.step) - 7 * (p.oct + 1)
const calcAlt = (p) => isAsc(p) ? p.alt : isPerf(p) ? -p.alt : -(p.alt + 1)

export function strIvl (pitch) {
  const p = isInterval(pitch) ? decode(pitch) : null
  if (!p) return null
  const num = calcNum(p)
  return p.dir * num + ivl.altToQ(num, calcAlt(p))
}
```

```js
const strPitch = (p) => p[2] ? strIvl(p) : strNote(p)
```

#### Decorate pitch transform functions

```js
const notation = (parse, str) => (v) => !isPitch(v) ? parse(v) : str(v)
```

```js
const id = (x) => x
const expectNote = notation(parseNote, id)
const expectIvl = notation(parseIvl, id)
const expectPitch = notation(parsePitch, id)
```

```js
const toNoteStr = notation(id, strNote)
const toIvlStr = notation(id, strIvl)
const toPitchStr = notation(id, strPitch)
```

```js
const buildFnDec = (expect, to) => (fn) => (v) => to(fn(expect(v)))
const noteFn = buildFnDec(expectNote, toNoteStr)
const ivlFn = buildFnDec(expectIvl, toIvlStr)
const pitchFn = buildFnDec(expectPitch, toPitchStr)
```

#### Pitch properties

```js
export const pc = noteFn((p) => [ p[0] ])
```

```js
export const letter = noteFn((n) => stepLetter(decode(n).step))
```

```js
export const accidentals = noteFn((n) => altAcc(decode(n).alt))
```

```js
export const octave = pitchFn((p) => decode(p).oct)
```

```js
export const simplify = ivlFn(function (i) {
  var d = i[2]
  var s = decodeStep(d * i[0])
  var a = decodeAlt(d * i[0])
  return [ i[0], -d * (FIFTH_OCTS[s] + 4 * a), d]
})
```

```js
export const simpleNum = ivlFn(function (i) {
  var p = decode(i)
  return p.step + 1
})
```

```js
export const number = ivlFn((i) => calcNum(decode(i)))
```

```js
export const quality = ivlFn((i) => {
  var p = decode(i)
  return ivl.altToQ(p.step + 1, p.alt)
})
```

__semitones__

```js
// get pitch height
const height = (p) => p[0] * 7 + 12 * p[1]
export const semitones = ivlFn(height)
```

#### Midi pitch numbers


The midi note number can have a value between 1-128:

```js
/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the number to test
 * @return {Boolean} true if it's a valid midi note number
 */
export const isMidi = (m) => !isArr(m) && m > 0 && m < 129
```

To match the general midi specification where `C4` is 60 we must add 12 to `height` function:

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
  var p = expectNote(val)
  return hasOct(p) ? height(p) + 12
    : isMidi(val) ? +val
    : null
}
```

Since any midi number can be mapped to different pitch names, we should select one arbitrarily:

```js
var CHROMATIC = [0, null, 1, null, 2, 3, null, 4, null, 5, null, 6]
const midiStep = (m) => CHROMATIC[m % 12]
export const chromatic = function (useSharps, midi) {
  if (arguments.length > 1) return chromatic(useSharps)(midi)
  return function (midi) {
    const c = midiStep(midi)
    const o = Math.floor(midi / 12) - 1
    const n = c !== null ? pitch(c, 0, o)
      : useSharps ? pitch(midiStep(midi - 1), 1, o)
      : pitch(midiStep(midi + 1), -1 , o)
    return strNote(n)
  }
}
export const fromMidi = chromatic(false)
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

## 2. Pitch distances

```js
function trBy (i, p) {
  const f = i[0] + p[0]
  if (p.length === 1) return [ f ]
  const o = i[1] + p[1]
  if (p.length === 2) return [ f, o ]
  const d = 7 * f + 12 * o < 0 ? -1 : 1
  return [ f, o, d ]
}
```

```js
export function transpose (a, b) {
  if (arguments.length === 1) return (b) => transpose(a, b)
  const pa = expectPitch(a)
  const pb = expectPitch(b)
  const r = isInterval(pa) ? trBy(pa, pb)
    : isInterval(pb) ? trBy(pb, pa) : null
  console.log('tr res', r)
  return toPitchStr(r)
}
```


## 3. Lists

```js
// items can be separated by spaces, bars and commas
const SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
export function listArr (src) {
  return isArr(src) ? src
    : typeof src === 'string' ? src.trim().split(SEP)
    : (src === null || typeof src === 'undefined') ? []
    : [ src ]
}
```

#### Transform lists

```js
const listToStr = (v) => isArr(v) ? v.map(toPitchStr) : toPitchStr(v)
```

```js
const listFn = (fn) => (src) => {
  var param = listArr(src)
  var result = fn(param)
  return isPitch(param[0]) ? result : listToStr(result)
}
```

```js
export function map (fn, list) {
  if (arguments.length > 1) return map(fn)(list)
  return listFn((arr) => arr.map(fn))
}
```

```js
const filter = (fn, list) => {
  if (arguments.length > 1) return filter(fn)(list)
  return listFn((arr) => arr.filter(fn))
}
```

```js
const reduce = (fn, o, list) => {
  if (arguments.length === 1) return (o, list) => reduce(fn, o)(list)
  if (arguments.length > 2) return reduce(fn, o)(list)
  return listFn((arr) => arr.reduce(fn, o))(list)
}
```

#### Sort lists

#### Transpose lists

```js
export const harmonize = (list, pitch) => {
  return listFn((list) => list.map(transpose(pitch)))(list)
}
```

Fin.
