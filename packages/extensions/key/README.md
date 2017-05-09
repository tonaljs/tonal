# tonal-key [![npm version](https://img.shields.io/npm/v/tonal-key.svg)](https://www.npmjs.com/package/tonal-key)

[![tonal](https://img.shields.io/badge/tonal-key-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-key` is a collection of functions to create and manipulate music keys.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-key`

## API Reference

<dl>
<dt><a href="#scale">scale(key)</a> ⇒ <code>Array</code></dt>
<dd><p>Get scale of a key</p>
</dd>
<dt><a href="#relative">relative(mode, key)</a></dt>
<dd><p>Get relative of a key. It can be partially applied.</p>
</dd>
<dt><a href="#alteredNotes">alteredNotes(key)</a> ⇒ <code>Array</code></dt>
<dd><p>Get a list of the altered notes of a given key. The notes will be in
the same order than in the key signature.</p>
</dd>
<dt><a href="#names">names(alias)</a> ⇒ <code>Array</code></dt>
<dd><p>Get a list of valid mode names. The list of modes will be always in
increasing order (ionian to locrian)</p>
</dd>
<dt><a href="#isKeyMode">isKeyMode(m)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Check if the given string is a valid mode name</p>
</dd>
<dt><a href="#build">build(tonic, mode)</a> ⇒ <code>Key</code></dt>
<dd><p>Build a key object from tonic a mode.</p>
<p>A key object is an array with the mode name and the tonic (or false if
no tonic specified)</p>
</dd>
<dt><a href="#fromAlter">fromAlter(alt)</a> ⇒ <code>Key</code></dt>
<dd><p>Create a major key from alterations</p>
</dd>
<dt><a href="#fromAcc">fromAcc(acc)</a> ⇒ <code>Key</code></dt>
<dd><p>Create a major key from accidentals</p>
</dd>
<dt><a href="#fromName">fromName(name)</a> ⇒ <code>Key</code></dt>
<dd><p>Create a key from key name</p>
</dd>
<dt><a href="#asKey">asKey(obj)</a> ⇒ <code>Key</code></dt>
<dd><p>Try to interpret the given object as a key. Given an object it will try to
parse as if it were a name, accidentals or alterations.</p>
</dd>
<dt><a href="#alteration">alteration(key)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get key alteration. The alteration is a number indicating the number of
sharpen notes (positive) or flaten notes (negative)</p>
</dd>
<dt><a href="#signature">signature()</a></dt>
<dd><p>Get the signature of a key. The signature is a string with sharps or flats.</p>
</dd>
<dt><a href="#accidentals">accidentals()</a></dt>
<dd><p>An alias for <code>signature()</code></p>
</dd>
</dl>

<a name="scale"></a>

## scale(key) ⇒ <code>Array</code>
Get scale of a key

**Kind**: global function  
**Returns**: <code>Array</code> - the key scale  

| Param | Type |
| --- | --- |
| key | <code>String</code> &#124; <code>Object</code> |

**Example**  
```js
var key = require('tonal-key')
key.scale('A major') // => [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ]
key.scale('Bb minor') // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab' ]
key.scale('C dorian') // => [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ]
key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
```
<a name="relative"></a>

## relative(mode, key)
Get relative of a key. It can be partially applied.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>String</code> | the relative destination |
| key | <code>String</code> | the key source |

**Example**  
```js
var key = require('tonal-keys')
key.relative('dorian', 'C major') // => ['dorian', 'D']
// partially application
var minor = key.relative('minor')
minor('C major') // => ['minor', 'A']
```
<a name="alteredNotes"></a>

## alteredNotes(key) ⇒ <code>Array</code>
Get a list of the altered notes of a given key. The notes will be in
the same order than in the key signature.

**Kind**: global function  

| Param | Type |
| --- | --- |
| key | <code>String</code> &#124; <code>Nunber</code> |

**Example**  
```js
var key = require('tonal-keys')
key.alteredNotes('Eb major') // => [ 'Bb', 'Eb', 'Ab' ]
```
<a name="names"></a>

## names(alias) ⇒ <code>Array</code>
Get a list of valid mode names. The list of modes will be always in
increasing order (ionian to locrian)

**Kind**: global function  
**Returns**: <code>Array</code> - an array of strings  

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>Boolean</code> | true to get aliases names |

<a name="isKeyMode"></a>

## isKeyMode(m) ⇒ <code>Boolean</code>
Check if the given string is a valid mode name

**Kind**: global function  

| Param | Type |
| --- | --- |
| m | <code>String</code> |

<a name="build"></a>

## build(tonic, mode) ⇒ <code>Key</code>
Build a key object from tonic a mode.

A key object is an array with the mode name and the tonic (or false if
no tonic specified)

**Kind**: global function  
**Returns**: <code>Key</code> - a key data object  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> | the key tonic (or null or false to no tonic) |
| mode | <code>String</code> | the keymode |

**Example**  
```js
var key = require('tonal-key')
key.build('g3', 'minor') // => ['minor', 'G']
key.build(false, 'locrian') // => ['locrian', false]
```
<a name="fromAlter"></a>

## fromAlter(alt) ⇒ <code>Key</code>
Create a major key from alterations

**Kind**: global function  
**Returns**: <code>Key</code> - the key object  

| Param | Type | Description |
| --- | --- | --- |
| alt | <code>Integer</code> | the alteration number (positive sharps, negative flats) |

**Example**  
```js
var key = require('tonal-key')
key.fromAlter(2) // => ['major', 'D']
```
<a name="fromAcc"></a>

## fromAcc(acc) ⇒ <code>Key</code>
Create a major key from accidentals

**Kind**: global function  
**Returns**: <code>Key</code> - the key object  

| Param | Type | Description |
| --- | --- | --- |
| acc | <code>String</code> | the accidentals string |

**Example**  
```js
var key = require('tonal-key')
key.fromAlter('bb') // => ['major', 'Bb']
```
<a name="fromName"></a>

## fromName(name) ⇒ <code>Key</code>
Create a key from key name

**Kind**: global function  
**Returns**: <code>Key</code> - the key object or null if not valid key  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the key name |

**Example**  
```js
var key = require('tonal-key')
key.fromName('C3 dorian') // => ['dorian', 'C']
key.fromName('blah') // => null
```
<a name="asKey"></a>

## asKey(obj) ⇒ <code>Key</code>
Try to interpret the given object as a key. Given an object it will try to
parse as if it were a name, accidentals or alterations.

**Kind**: global function  
**Returns**: <code>Key</code> - the key object or null  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> |

<a name="alteration"></a>

## alteration(key) ⇒ <code>Integer</code>
Get key alteration. The alteration is a number indicating the number of
sharpen notes (positive) or flaten notes (negative)

**Kind**: global function  

| Param | Type |
| --- | --- |
| key | <code>String</code> &#124; <code>Integer</code> |

**Example**  
```js
var key = require('tonal-keys')
key.alteration('A major') // => 3
```
<a name="signature"></a>

## signature()
Get the signature of a key. The signature is a string with sharps or flats.

**Kind**: global function  
**Example**  
```js
var key = require('tonal-keys')
key.signature('A major') // => '###'
```
<a name="accidentals"></a>

## accidentals()
An alias for `signature()`

**Kind**: global function  
