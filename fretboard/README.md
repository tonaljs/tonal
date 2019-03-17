<a name="module_fretboard"></a>

# fretboard
This module has functions to create fretboards and query for instrument
tunnings.

__Currently is NOT part of the tonal distribution__


* [fretboard](#module_fretboard)
    * [`.tuning(name)`](#module_fretboard.tuning) ⇒ <code>Array</code>
    * [`.simpleTuning(name)`](#module_fretboard.simpleTuning) ⇒ <code>Array</code>
    * [`.names(aliases)`](#module_fretboard.names) ⇒ <code>Array</code>
    * [`.notes(tuning, first, last, set)`](#module_fretboard.notes) ⇒ <code>Array</code>
    * [`.scale(tuning, scale, first, last)`](#module_fretboard.scale) ⇒ <code>Array</code>
    * [`.chordShapes(tuning, notes, first, last, span)`](#module_fretboard.chordShapes) ⇒ <code>Array</code>

<a name="module_fretboard.tuning"></a>

## `fretboard.tuning(name)` ⇒ <code>Array</code>
Given a tuning name, returns the notes of the strings in the open position

**Kind**: static method of [<code>fretboard</code>](#module_fretboard)  
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
<a name="module_fretboard.simpleTuning"></a>

## `fretboard.simpleTuning(name)` ⇒ <code>Array</code>
Given a tuning name returns the notes of the strings in open position
as pitch classes removing doubled strings.

**Kind**: static method of [<code>fretboard</code>](#module_fretboard)  
**Returns**: <code>Array</code> - the string notes as pitch classes  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the tuning name or notes of the strings in open position |

**Example**  
```js
fret.simpleTuning('guitar') => [ 'E', 'A', 'D', 'G', 'B', 'E' ]
fret.simpleTuning('charango') => [ 'G', 'C', 'E', 'A', 'E' ]
```
<a name="module_fretboard.names"></a>

## `fretboard.names(aliases)` ⇒ <code>Array</code>
Get all available tuning names

**Kind**: static method of [<code>fretboard</code>](#module_fretboard)  
**Returns**: <code>Array</code> - an array of tuning names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>Boolean</code> | get aliases or not |

<a name="module_fretboard.notes"></a>

## `fretboard.notes(tuning, first, last, set)` ⇒ <code>Array</code>
Build a fretboard using a given tuning (or tuning name), first and last
fret numbers and optionally a chord or scale

It returns an array of arrays, where each sub-array is the notes of
a string.

**Kind**: static method of [<code>fretboard</code>](#module_fretboard)  
**Returns**: <code>Array</code> - An array of arrays, one for each string  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>String</code> \| <code>Array</code> | the tuning name or notes |
| first | <code>Integer</code> | the first fret number |
| last | <code>Integer</code> | the last fret number |
| set | <code>Array</code> \| <code>String</code> | a scale or chord to filter the fretboard |

<a name="module_fretboard.scale"></a>

## `fretboard.scale(tuning, scale, first, last)` ⇒ <code>Array</code>
Build a fretboard only showing the notes for the given scale.

**Kind**: static method of [<code>fretboard</code>](#module_fretboard)  
**Returns**: <code>Array</code> - An array of arrays, one for each string  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>String</code> \| <code>Array</code> | the tuning name or notes |
| scale | <code>String</code> \| <code>Array</code> | the scale notes |
| first | <code>Integer</code> | the first fret number |
| last | <code>Integer</code> | the last fret number |

<a name="module_fretboard.chordShapes"></a>

## `fretboard.chordShapes(tuning, notes, first, last, span)` ⇒ <code>Array</code>
Build an array of reachable chord shapes based on given notes and tuning.

**Kind**: static method of [<code>fretboard</code>](#module_fretboard)  
**Returns**: <code>Array</code> - An array of arrays, one for each possible shape.  Element index is string number [ '0', '2', '2', '1', '0', '0' ]  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>String</code> \| <code>Array</code> | the tuning name or notes |
| notes | <code>Array</code> | an array of chord notes |
| first | <code>Integer</code> | the first fret number.  Default 0. |
| last | <code>Integer</code> | the last fret number.  Default 12. |
| span | <code>Integer</code> | how many frets to include per position.  Default 4. |

