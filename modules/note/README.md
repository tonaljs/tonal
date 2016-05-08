# tonal-note [![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)

[![tonal](https://img.shields.io/badge/tonal-note-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-note` is a collection of functions to manipulate music note properties.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-note`

## API Reference

<dl>
<dt><a href="#chroma">chroma(note)</a> ⇒ <code>Integer</code></dt>
<dd><p>Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B</p>
</dd>
<dt><a href="#noteName">noteName(n)</a> ⇒ <code>String</code></dt>
<dd><p>Given a note (as string or as array notation) returns a string
with the note name in scientific notation or null
if not valid note</p>
</dd>
<dt><a href="#pc">pc(n)</a> ⇒ <code>String</code></dt>
<dd><p>Get pitch class of a note. The note can be a string or a pitch array.</p>
</dd>
<dt><a href="#enharmonics">enharmonics(note)</a> ⇒ <code>Array</code></dt>
<dd><p>Get the enharmonics of a note. It returns an array of three elements: the
below enharmonic, the note, and the upper enharmonic</p>
</dd>
<dt><a href="#enh">enh()</a></dt>
<dd><p>An alias for <code>enharmonics</code></p>
</dd>
<dt><a href="#simpleEnh">simpleEnh(note)</a> ⇒ <code>String</code></dt>
<dd><p>Get a simpler enharmonic note name from a note if exists</p>
</dd>
</dl>

<a name="chroma"></a>

## chroma(note) ⇒ <code>Integer</code>
Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B

**Kind**: global function  
**Returns**: <code>Integer</code> - the chroma  

| Param | Type |
| --- | --- |
| note | <code>String</code> &#124; <code>Pitch</code> |

<a name="noteName"></a>

## noteName(n) ⇒ <code>String</code>
Given a note (as string or as array notation) returns a string
with the note name in scientific notation or null
if not valid note

**Kind**: global function  

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
tonal.map(tonal.noteName, 'c db3 2 g+ gx4')
```
<a name="pc"></a>

## pc(n) ⇒ <code>String</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: global function  
**Returns**: <code>String</code> - the pitch class  

| Param | Type |
| --- | --- |
| n | <code>String</code> &#124; <code>Pitch</code> |

**Example**  
```js
tonal.pc('Db3') // => 'Db'
```
<a name="enharmonics"></a>

## enharmonics(note) ⇒ <code>Array</code>
Get the enharmonics of a note. It returns an array of three elements: the
below enharmonic, the note, and the upper enharmonic

**Kind**: global function  
**Returns**: <code>Array</code> - an array of pitches ordered by distance to the given one  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to get the enharmonics from |

**Example**  
```js
enharmonics = require('enharmonics')
enharmonics('C') // => ['B#', 'C', 'Dbb']
enharmonics('A') // => ['G##', 'A', 'Bbb']
enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
```
<a name="enh"></a>

## enh()
An alias for `enharmonics`

**Kind**: global function  
<a name="simpleEnh"></a>

## simpleEnh(note) ⇒ <code>String</code>
Get a simpler enharmonic note name from a note if exists

**Kind**: global function  
**Returns**: <code>String</code> - the simplfiied note (if not found, return same note)  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to simplify |

**Example**  
```js
var enharmonics = require('enharmonics')
enharmonics.simpleEnh('B#3') // => 'C4'
```
