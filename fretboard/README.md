<a name="module_Fretboard"></a>

# Fretboard
This module has functions to create fretboards and query for instrument
tunnings.

## Usage

```js
// ES6 modules (import)
import Fretboard from 'tonal/fret-board'
Fretboard.tuning('guitar') // => [ 'E2', 'A2', 'D3', 'G3', 'B3', 'E4' ]
```

## API


* [Fretboard](#module_Fretboard)
    * [`.tuning(name)`](#module_Fretboard.tuning) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.tuningNames()`](#module_Fretboard.tuningNames) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.simpleTuning(name)`](#module_Fretboard.simpleTuning) ⇒ <code>Array</code>
    * [`.notes(tuning, first, last, set)`](#module_Fretboard.notes) ⇒ <code>Array</code>
    * [`.scale(tuning, scale, first, last)`](#module_Fretboard.scale) ⇒ <code>Array</code>
    * [`.chordShapes(tuning, notes, first, last, span)`](#module_Fretboard.chordShapes) ⇒ <code>Array</code>

<a name="module_Fretboard.tuning"></a>

## `Fretboard.tuning(name)` ⇒ <code>Array.&lt;string&gt;</code>
Given a tuning name, returns the notes of the strings in the open position

**Kind**: static method of [<code>Fretboard</code>](#module_Fretboard)  
**Returns**: <code>Array.&lt;string&gt;</code> - the notes or empty array if no tuning found  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the tuning name |

**Example**  
```js
Fretboard.tuning('guitar') // => [ 'E2', 'A2', 'D3', 'G3', 'B3', 'E4' ]
Fretboard.tuning('charango') // => [ 'G4', 'G4', 'C5', 'C5', 'E5', 'E4', 'A4', 'A4', 'E5', 'E5' ]
```
<a name="module_Fretboard.tuningNames"></a>

## `Fretboard.tuningNames()` ⇒ <code>Array.&lt;string&gt;</code>
Get tuning names

**Kind**: static method of [<code>Fretboard</code>](#module_Fretboard)  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of available tunings  
**Example**  
```js
Fretboard.tuningNames() // => ['guitar', 'guitar open D', ...]
```
<a name="module_Fretboard.simpleTuning"></a>

## `Fretboard.simpleTuning(name)` ⇒ <code>Array</code>
Given a tuning name returns the notes of the strings in open position
as pitch classes removing doubled strings.

**Kind**: static method of [<code>Fretboard</code>](#module_Fretboard)  
**Returns**: <code>Array</code> - the string notes as pitch classes  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the tuning name or notes of the strings in open position |

**Example**  
```js
fret.simpleTuning('guitar') => [ 'E', 'A', 'D', 'G', 'B', 'E' ]
fret.simpleTuning('charango') => [ 'G', 'C', 'E', 'A', 'E' ]
```
<a name="module_Fretboard.notes"></a>

## `Fretboard.notes(tuning, first, last, set)` ⇒ <code>Array</code>
Build a fretboard using a given tuning (or tuning name), first and last
fret numbers and optionally a chord or scale

It returns an array of arrays, where each sub-array is the notes of
a string.

**Kind**: static method of [<code>Fretboard</code>](#module_Fretboard)  
**Returns**: <code>Array</code> - An array of arrays, one for each string  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>string</code> \| <code>Array</code> | the tuning name or notes |
| first | <code>Integer</code> | the first fret number |
| last | <code>Integer</code> | the last fret number |
| set | <code>Array</code> \| <code>string</code> | a scale or chord to filter the fretboard |

<a name="module_Fretboard.scale"></a>

## `Fretboard.scale(tuning, scale, first, last)` ⇒ <code>Array</code>
Build a fretboard only showing the notes for the given scale.

**Kind**: static method of [<code>Fretboard</code>](#module_Fretboard)  
**Returns**: <code>Array</code> - An array of arrays, one for each string  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>string</code> \| <code>Array</code> | the tuning name or notes |
| scale | <code>string</code> \| <code>Array</code> | the scale notes |
| first | <code>Integer</code> | the first fret number |
| last | <code>Integer</code> | the last fret number |

<a name="module_Fretboard.chordShapes"></a>

## `Fretboard.chordShapes(tuning, notes, first, last, span)` ⇒ <code>Array</code>
Build an array of reachable chord shapes based on given notes and tuning.

**Kind**: static method of [<code>Fretboard</code>](#module_Fretboard)  
**Returns**: <code>Array</code> - An array of arrays, one for each possible shape.  Element index is string number [ '0', '2', '2', '1', '0', '0' ]  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>string</code> \| <code>Array</code> | the tuning name or notes |
| notes | <code>Array</code> | an array of chord notes |
| first | <code>Integer</code> | the first fret number.  Default 0. |
| last | <code>Integer</code> | the last fret number.  Default 12. |
| span | <code>Integer</code> | how many frets to include per position.  Default 4. |

