# tonal-chord [![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)

[![tonal](https://img.shields.io/badge/tonal-chord-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-chord` is a collection of functions to create and manipulate music chords.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-chord`

## Generated API documentation
<a name="module_chord"></a>

A chord is a harmonic unit with at least three different tones sounding simultaneously.

This module have functions to create and manipulate chords. It includes a
chord dictionary and a simple chord detection algorithm.

**Example**  
```js
var chord = require('tonal-chord')
chord.detect('c b g e') // => 'CMaj7'
chord.get('CMaj7') // => ['C', 'E', 'G', 'B']
```

* [chord](#module_chord)
    * [.names(aliases)](#module_chord.names) ⇒ <code>Array</code>
    * [.get(type, tonic)](#module_chord.get) ⇒ <code>Array.&lt;String&gt;</code>
    * [.notes(chord)](#module_chord.notes) ⇒ <code>Array.&lt;String&gt;</code>
    * [.intervals(name)](#module_chord.intervals) ⇒ <code>Array.&lt;String&gt;</code>
    * [.isKnownChord(name)](#module_chord.isKnownChord) ⇒ <code>Boolean</code>
    * [.detect(notes)](#module_chord.detect) ⇒ <code>Array.&lt;String&gt;</code>
    * [.position(chord)](#module_chord.position) ⇒ <code>Integer</code>
    * [.inversion(num, chord)](#module_chord.inversion) ⇒ <code>Array</code>
    * [.parse(name)](#module_chord.parse) ⇒ <code>Array</code>

<a name="module_chord.names"></a>

### chord.names(aliases) ⇒ <code>Array</code>
Return the available chord names

**Kind**: static method of <code>[chord](#module_chord)</code>  
**Returns**: <code>Array</code> - the chord names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
var chord = require('tonal-chord')
chord.names() // => ['maj7', ...]
```
<a name="module_chord.get"></a>

### chord.get(type, tonic) ⇒ <code>Array.&lt;String&gt;</code>
Get chord notes or intervals from chord type

This function is currified

**Kind**: static method of <code>[chord](#module_chord)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - the chord notes or intervals, or null if not valid type  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | the chord type |
| tonic | <code>Strng</code> &#124; <code>Pitch</code> | the tonic or false to get the intervals |

**Example**  
```js
chords.get('dom7', 'C') // => ['C', 'E', 'G', 'Bb']
maj7 = chords.get('Maj7')
maj7('C') // => ['C', 'E', 'G', 'B']
```
<a name="module_chord.notes"></a>

### chord.notes(chord) ⇒ <code>Array.&lt;String&gt;</code>
Get the chord notes of a chord. This function accepts either a chord name
(for example: 'Cmaj7') or a list of notes.

It always returns an array, even if the chord is not found.

**Kind**: static method of <code>[chord](#module_chord)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - a list of notes or empty list if not chord found  

| Param | Type | Description |
| --- | --- | --- |
| chord | <code>String</code> &#124; <code>Array</code> | the chord to get the notes from |

**Example**  
```js
chord.notes('Cmaj7') // => ['C', 'E', 'G', 'B']
```
<a name="module_chord.intervals"></a>

### chord.intervals(name) ⇒ <code>Array.&lt;String&gt;</code>
Get chord intervals

**Kind**: static method of <code>[chord](#module_chord)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - a list of intervals or null if the type is not known  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the chord name (optionally a tonic and type) |

<a name="module_chord.isKnownChord"></a>

### chord.isKnownChord(name) ⇒ <code>Boolean</code>
Check if a given name correspond to a chord in the dictionary

**Kind**: static method of <code>[chord](#module_chord)</code>  

| Param | Type |
| --- | --- |
| name | <code>String</code> |

**Example**  
```js
chord.isKnownChord('CMaj7') // => true
chord.isKnownChord('Maj7') // => true
chord.isKnownChord('Ablah') // => false
```
<a name="module_chord.detect"></a>

### chord.detect(notes) ⇒ <code>Array.&lt;String&gt;</code>
Detect a chord. Given a list of notes, return the chord name(s) if any.
It only detects chords with exactly same notes.

**Kind**: static method of <code>[chord](#module_chord)</code>  
**Returns**: <code>Array.&lt;String&gt;</code> - an array with the possible chords  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array</code> &#124; <code>String</code> | the list of notes |

**Example**  
```js
chord.detect('b g f# d') // => [ 'GMaj7' ]
chord.detect('e c a g') // => [ 'CM6', 'Am7' ]
```
<a name="module_chord.position"></a>

### chord.position(chord) ⇒ <code>Integer</code>
Get the position (inversion number) of a chord (0 is root position, 1 is first
inversion...). It assumes the chord is formed by superposed thirds.

**Kind**: static method of <code>[chord](#module_chord)</code>  
**Returns**: <code>Integer</code> - the inversion number (0 for root inversion, 1 for first
inversion...) or null if not a valid chord  

| Param | Type | Description |
| --- | --- | --- |
| chord | <code>Array</code> &#124; <code>String</code> | the chord notes |

**Example**  
```js
chord.position('e g c') // => 1
chord.position('g3 e2 c5') // => 1 (e is the lowest note)
```
<a name="module_chord.inversion"></a>

### chord.inversion(num, chord) ⇒ <code>Array</code>
Given a chord in any inverstion, set to the given inversion. It accepts
chord names

**Kind**: static method of <code>[chord](#module_chord)</code>  
**Returns**: <code>Array</code> - the chord pitch classes in the desired inversion  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Integer</code> | the inversion number (0 root position, 1 first inversion, ...) |
| chord | <code>String</code> &#124; <code>Array</code> | the chord name or notes |

**Example**  
```js
chord.inversion(1, 'Cmaj7') // => [ 'E', 'G', 'B', 'C' ]
chord.inversion(0, 'e g c') // => [ 'C', 'E', 'G' ]
```
<a name="module_chord.parse"></a>

### chord.parse(name) ⇒ <code>Array</code>
Try to parse a chord name. It returns an array with the chord type and
the tonic. If not tonic is found, all the name is considered the chord
name.

This function does NOT check if the chord type exists or not. It only tries
to split the tonic and chord type.

**Kind**: static method of <code>[chord](#module_chord)</code>  
**Returns**: <code>Array</code> - an array with [type, tonic]  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the chord name |

**Example**  
```js
chord.parse('Cmaj7') // => { tonic: 'C', type: 'maj7' }
chord.parse('C7') // => { tonic: 'C', type: '7' }
chord.parse('mMaj7') // => { tonic: false, type: 'mMaj7' }
chord.parse('Cnonsense') // => { tonic: 'C', type: 'nonsense' }
```
