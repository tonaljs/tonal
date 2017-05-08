# tonal-scale [![npm version](https://img.shields.io/npm/v/tonal-scale.svg)](https://www.npmjs.com/package/tonal-scale)

[![tonal](https://img.shields.io/badge/tonal-scale-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-scale` is a collection of functions to create and manipulate music scales.

```js
var scale = require('tonal-scale')
scale.get('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-scale`

## Generated API documentation
<a name="module_scale"></a>

A scale is a collection of pitches in ascending or descending order.

This module provides functions to get and manipulate scales.

**Example**  
```js
scale.notes('Ab bebop') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'G' ]
scale.get('hungarian major', 'B3') // => [ 'B3', 'C##4', 'D#4', 'E#4', 'F#4', 'G#4', 'A4'
scale.get('C E F G', 'F') // => [ 'F', 'A', 'Bb', 'C' ]
scale.get('1P 2M 3M 5P 6M', 'D4') // => [ 'D4', 'E4', 'F#4', 'A4', 'B4' ]
scale.names() => ['major', 'minor', ...]
scale.detect('f5 d2 c5 b5 a2 e4 g') // => [ 'C major', 'D dorian', 'E phrygian', 'F lydian', 'G mixolydian', 'A aeolian', 'B locrian'])
```

* [scale](#module_scale)
    * [.get(source, tonic)](#module_scale.get) ⇒ <code>Array</code>
    * [.names(aliases)](#module_scale.names) ⇒ <code>Array</code>
    * [.notes(src)](#module_scale.notes) ⇒ <code>Array</code>
    * [.intervals(name)](#module_scale.intervals) ⇒ <code>Array.&lt;String&gt;</code>
    * [.isKnowScale(name)](#module_scale.isKnowScale) ⇒ <code>Boolean</code>
    * [.parse(name)](#module_scale.parse) ⇒ <code>Object</code>
    * [.detect(notes)](#module_scale.detect) ⇒ <code>Array.&lt;String&gt;</code>

<a name="module_scale.get"></a>

### scale.get(source, tonic) ⇒ <code>Array</code>
Transpose the given scale notes, intervals or name to a given tonic.
The returned scale is an array of notes (or intervals if you specify `false` as tonic)

This function is currified

**Kind**: static method of <code>[scale](#module_scale)</code>  
**Returns**: <code>Array</code> - the scale notes  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> | the scale type, intervals or notes |
| tonic | <code>String</code> | the scale tonic (or false to get intervals) |

**Example**  
```js
scale.get('bebop', 'Eb') // => [ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ]
scale.get('major', false) // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
var major = scale.get('major')
major('Db3') // => [ 'Db3', 'Eb3', 'F3', 'Gb3', 'Ab3', 'Bb3', 'C4' ]
```
<a name="module_scale.names"></a>

### scale.names(aliases) ⇒ <code>Array</code>
Return the available scale names

**Kind**: static method of <code>[scale](#module_scale)</code>  
**Returns**: <code>Array</code> - the scale names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
var scale = require('tonal-scale')
scale.names() // => ['maj7', ...]
```
<a name="module_scale.notes"></a>

### scale.notes(src) ⇒ <code>Array</code>
Get the notes (pitch classes) of a scale. It accepts either a scale name
(tonic and type) or a collection of notes.

Note that it always returns an array, and the values are only pitch classes.

**Kind**: static method of <code>[scale](#module_scale)</code>  
**Returns**: <code>Array</code> - the scale pitch classes  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>String</code> &#124; <code>Array</code> | the scale name (it must include the scale type and a tonic. The tonic can be a note or a pitch class) or the list of notes |

**Example**  
```js
scale.notes('C major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
scale.notes('C4 major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
scale.notes('Ab bebop') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'G' ]
scale.notes('C4 D6 E2 c7 a2 b5 g2 g4 f') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```
<a name="module_scale.intervals"></a>

### scale.intervals(name) ⇒ <code>Array.&lt;String&gt;</code>
Given a scale name, return its intervals. The name can be the type and
optionally the tonic (which is ignored)

**Kind**: static method of <code>[scale](#module_scale)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - the scale intervals if is a known scale, null otherwise  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name (tonic and type, tonic is optional) |

**Example**  
```js
scale.intervals('C major')
```
<a name="module_scale.isKnowScale"></a>

### scale.isKnowScale(name) ⇒ <code>Boolean</code>
Check if the given name (and optional tonic and type) is a know scale

**Kind**: static method of <code>[scale](#module_scale)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name |

**Example**  
```js
scale.intervals('C major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
scale.intervals('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ])
scale.intervals('mixophrygian') // => null
```
<a name="module_scale.parse"></a>

### scale.parse(name) ⇒ <code>Object</code>
Given a string try to parse as scale name. It retuns an object with the
form { tonic, type } where tonic is the note or false if no tonic specified
and type is the rest of the string minus the tonic

Note that this function doesn't check that the scale type is a valid scale
type or if is present in any scale dictionary.

**Kind**: static method of <code>[scale](#module_scale)</code>  
**Returns**: <code>Object</code> - an object { tonic, type }  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name |

**Example**  
```js
scale.parse('C mixoblydean') // => { tonic: 'C', type: 'mixoblydean' }
scale.parse('anything is valid') // => { tonic: false, type: 'anything is valid'}
```
<a name="module_scale.detect"></a>

### scale.detect(notes) ⇒ <code>Array.&lt;String&gt;</code>
Detect a scale. Given a list of notes, return the scale name(s) if any.
It only detects chords with exactly same notes.

**Kind**: static method of <code>[scale](#module_scale)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - an array with the possible scales  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array</code> &#124; <code>String</code> | the list of notes |

**Example**  
```js
scale.detect('b g f# d') // => [ 'GMaj7' ]
scale.detect('e c a g') // => [ 'CM6', 'Am7' ]
```
