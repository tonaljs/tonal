# tonal-progression [![npm version](https://img.shields.io/npm/v/tonal-progression.svg)](https://www.npmjs.com/package/tonal-progression)

[![tonal](https://img.shields.io/badge/tonal-progression-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-progression` is a collection of functions to create and manipulate chord progressions.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-progression`

## API Reference

<dl>
<dt><a href="#build">build(tonic, progression)</a> ⇒ <code>Array</code></dt>
<dd><p>Get chord progression from a tonic and a list of chord in roman numerals</p>
</dd>
<dt><a href="#romanRegex">romanRegex()</a> ⇒ <code>RegExp</code></dt>
<dd><p>Returns a regex to match roman numbers literals with the from:
<code>[accidentals]roman[element]</code>.</p>
</dd>
<dt><a href="#parseRomanChord">parseRomanChord(str)</a> ⇒ <code>Object</code></dt>
<dd><p>Parse a chord expressed with roman numerals. It returns an interval representing
the root of the chord relative to the key tonic and the chord name.</p>
</dd>
</dl>

<a name="build"></a>

## build(tonic, progression) ⇒ <code>Array</code>
Get chord progression from a tonic and a list of chord in roman numerals

**Kind**: global function  
**Returns**: <code>Array</code> - the chord progression  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> | the tonic |
| progression | <code>Array</code> &#124; <code>String</code> | the progression in roman numerals |

**Example**  
```js
var progression = require('chord-progression')
progression.build('I IIm7 V7', 'C') // => ['C', 'Dm7', 'G7']
```
<a name="romanRegex"></a>

## romanRegex() ⇒ <code>RegExp</code>
Returns a regex to match roman numbers literals with the from:
`[accidentals]roman[element]`.

The executed regex contains:
accidentals: (Optional) one or two flats (b) or shaprs (#)
roman: (Required) a roman numeral from I to VII either in upper or lower case
element: (Optional) a name of an element

**Kind**: global function  
**Returns**: <code>RegExp</code> - the regexp  
**Example**  
```js
r.exec('bVII')
r.exec('IVMaj7')
r.exec('ii minor')
```
<a name="parseRomanChord"></a>

## parseRomanChord(str) ⇒ <code>Object</code>
Parse a chord expressed with roman numerals. It returns an interval representing
the root of the chord relative to the key tonic and the chord name.

**Kind**: global function  
**Returns**: <code>Object</code> - the roman number in array notation or null if not valid numeral  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the roman numeral string |

**Example**  
```js
var parse = require('music-notation/roman.parse')
parse('V7') // => { root: ['tnl', 1, 0, 0, 1], name: '7'}
parse('bIIalt') // => [ root: ['tnl', -5, 0, 2, 1], name: 'alt']
```
