# tonal-note [![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)

[![tonal](https://img.shields.io/badge/tonal-note-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-note` is a collection of functions to extract properties from musical notes.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-note`

[Read the generated API documentation](https://danigb.github.io/tonal/api/module-note.html).

## API
<a name="module_note"></a>

`tonal-note` is a collection of functions to get properties from musical notes.

**Example**  
```js
var note = require('tonal-note')
note.name('bb2') // => 'Bb2'
note.chroma('bb2') // => 10
note.enharmonics('C#6') // => [ 'B##5', 'C#6', 'Db6' ]
note.simplify('B#3') // => 'C4'
```

* [note](#module_note)
    * [.chroma(note)](#module_note.chroma) ⇒ <code>Integer</code>
    * [.name(n)](#module_note.name) ⇒ <code>String</code>
    * [.pc(n)](#module_note.pc) ⇒ <code>String</code>
    * [.enharmonics(note)](#module_note.enharmonics) ⇒ <code>Array</code>
    * [.simplify(note)](#module_note.simplify) ⇒ <code>String</code>

<a name="module_note.chroma"></a>

### note.chroma(note) ⇒ <code>Integer</code>
Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Integer</code> - the chroma  

| Param | Type |
| --- | --- |
| note | <code>String</code> &#124; <code>Pitch</code> |

**Example**  
```js
['C', 'D', 'E', 'F'].map(_.chroma) // => [0, 2, 4, 5]
_.map(_.chroma, 'cb db eb fb') // => [11, 1, 3, 4]
```
<a name="module_note.name"></a>

### note.name(n) ⇒ <code>String</code>
Given a note (as string or as array notation) returns a string
with the note name in scientific notation or null
if not valid note

**Kind**: static method of <code>[note](#module_note)</code>  

| Param | Type |
| --- | --- |
| n | <code>Pitch</code> &#124; <code>String</code> |

**Example**  
```js
import { noteName } from 'tonal-notes'
['c', 'db3', '2', 'g+', 'gx4'].map(noteName)
// => ['C', 'Db3', null, null, 'G##4']
```
**Example**  
```js
var tonal = require('tonal')
tonal.noteName('cb2') // => 'Cb2'
tonal.map(tonal.noteName, 'c db3 2 g+ gx4') // => [ 'C', 'Db3', null, null, 'G##4' ]
```
<a name="module_note.pc"></a>

### note.pc(n) ⇒ <code>String</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>String</code> - the pitch class  

| Param | Type |
| --- | --- |
| n | <code>String</code> &#124; <code>Pitch</code> |

**Example**  
```js
tonal.pc('Db3') // => 'Db'
tonal.map(tonal.pc, 'db3 bb6 fx2') // => [ 'Db', 'Bb', 'F##']
```
<a name="module_note.enharmonics"></a>

### note.enharmonics(note) ⇒ <code>Array</code>
Get the enharmonics of a note. It returns an array of three elements: the
below enharmonic, the note, and the upper enharmonic

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Array</code> - an array of pitches ordered by distance to the given one  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to get the enharmonics from |

**Example**  
```js
var note = require('tonal-note')
note.enharmonics('C') // => ['B#', 'C', 'Dbb']
note.enharmonics('A') // => ['G##', 'A', 'Bbb']
note.enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
note.enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
```
<a name="module_note.simplify"></a>

### note.simplify(note) ⇒ <code>String</code>
Get a simpler enharmonic note name from a note if exists

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>String</code> - the simplfiied note (if not found, return same note)  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to simplify |

**Example**  
```js
var note = require('tonal-note')
note.simplify('B#3') // => 'C4'
```
