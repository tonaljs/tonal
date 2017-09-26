# tonal-fretboard [![npm version](https://img.shields.io/npm/v/tonal-fretboard.svg)](https://www.npmjs.com/package/tonal-fretboard)

[![tonal](https://img.shields.io/badge/tonal-fretboard-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-fretboard` is a module to represent notes in a fretboard.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-fretboard`

## API Reference

<dl>
<dt><a href="#tuning">tuning(name)</a> ⇒ <code>Array</code></dt>
<dd><p>Given a tuning name, returns the notes of the strings in the open position</p>
</dd>
<dt><a href="#simpleTuning">simpleTuning(name)</a> ⇒ <code>Array</code></dt>
<dd><p>Given a tuning name returns the notes of the strings in open position
as pitch classes removing doubled strings.</p>
</dd>
<dt><a href="#names">names(aliases)</a> ⇒ <code>Array</code></dt>
<dd><p>Get all available tuning names</p>
</dd>
<dt><a href="#build">build(tuning, first, last)</a> ⇒ <code>Array</code></dt>
<dd><p>Build a fretboard using a given tuning (or tuning name) and first and last
fret numbers</p>
</dd>
<dt><a href="#scale">scale(tuning, scale, first, last)</a> ⇒ <code>Array</code></dt>
<dd><p>Build a fretboard only showing the notes for the given scale.</p>
</dd>
<dt><a href="#chordShapes">chordShapes(tuning, notes, first, last, span)</a> ⇒ <code>Array</code></dt>
<dd><p>Build an array of reachable chord shapes based on given notes and tuning.</p>
</dd>
</dl>

<a name="tuning"></a>

## tuning(name) ⇒ <code>Array</code>
Given a tuning name, returns the notes of the strings in the open position

**Kind**: global function  
**Returns**: <code>Array</code> - the string notes or null if not valid tuning name  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the tuning name |

**Example**  
```js
var fret = require('tonal-fretboard')
fret.tuning('guitar') // => [ 'E2', 'A2', 'D3', 'G3', 'B3', 'E4' ]
fret.tuning('charango') // => [ 'G4', 'G4', 'C5', 'C5', 'E5', 'E4', 'A4', 'A4', 'E5', 'E5' ]
```
<a name="simpleTuning"></a>

## simpleTuning(name) ⇒ <code>Array</code>
Given a tuning name returns the notes of the strings in open position
as pitch classes removing doubled strings.

**Kind**: global function  
**Returns**: <code>Array</code> - the string notes as pitch classes  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the tuning name or notes of the strings in open position |

**Example**  
```js
fret.simpleTuning('guitar') => [ 'E', 'A', 'D', 'G', 'B', 'E' ]
fret.simpleTuning('charango') => [ 'G', 'C', 'E', 'A', 'E' ]
```
<a name="names"></a>

## names(aliases) ⇒ <code>Array</code>
Get all available tuning names

**Kind**: global function  
**Returns**: <code>Array</code> - an array of tuning names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>Boolean</code> | get aliases or not |

<a name="build"></a>

## build(tuning, first, last) ⇒ <code>Array</code>
Build a fretboard using a given tuning (or tuning name) and first and last
fret numbers

**Kind**: global function  
**Returns**: <code>Array</code> - An array of arrays, one for each string  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>String</code> &#124; <code>Array</code> | the tuning name or notes |
| first | <code>Integer</code> | the first fret number |
| last | <code>Integer</code> | the last fret number |

<a name="scale"></a>

## scale(tuning, scale, first, last) ⇒ <code>Array</code>
Build a fretboard only showing the notes for the given scale.

**Kind**: global function  
**Returns**: <code>Array</code> - An array of arrays, one for each string  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>String</code> &#124; <code>Array</code> | the tuning name or notes |
| scale | <code>String</code> &#124; <code>Array</code> | the scale notes |
| first | <code>Integer</code> | the first fret number |
| last | <code>Integer</code> | the last fret number |

<a name="chordShapes"></a>

## chordShapes(tuning, notes, first, last, span) ⇒ <code>Array</code>
Build an array of reachable chord shapes based on given notes and tuning.

**Kind**: global function  
**Returns**: <code>Array</code> - An array of arrays, one for each possible shape.

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>String</code> &#124; <code>Array</code> | the tuning name or notes |
| notes | <code>Array</code> | an array of chord notes |
| first | <code>Integer</code> | the first fret number |
| last | <code>Integer</code> | the last fret number |
| span | <code>Integer</code> | how many frets to include per position |
