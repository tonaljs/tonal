# tonal-transpose [![npm version](https://img.shields.io/npm/v/tonal-transpose.svg)](https://www.npmjs.com/package/tonal-transpose)

[![tonal](https://img.shields.io/badge/tonal-transpose-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-transpose` is a collection of functions to transpose music notes using note names and interval names. It can be used to add intervals.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-transpose`

## API Reference

<dl>
<dt><a href="#transpose">transpose(a, b)</a> ⇒ <code>String</code> | <code>Pitch</code></dt>
<dd><p>Transpose notes. Can be used to add intervals. At least one of the parameter
is expected to be an interval. If not, it returns null.</p>
</dd>
<dt><a href="#tr">tr()</a></dt>
<dd><p>An alias for <code>transpose</code></p>
</dd>
<dt><a href="#trFifths">trFifths(tonic, number)</a> ⇒ <code>String</code> | <code>Pitch</code></dt>
<dd><p>Transpose a tonic a number of perfect fifths. It can be partially applied.</p>
</dd>
</dl>

<a name="transpose"></a>

## transpose(a, b) ⇒ <code>String</code> &#124; <code>Pitch</code>
Transpose notes. Can be used to add intervals. At least one of the parameter
is expected to be an interval. If not, it returns null.

**Kind**: global function  
**Returns**: <code>String</code> &#124; <code>Pitch</code> - the transposed pitch or null if not valid parameters  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>String</code> &#124; <code>Pitch</code> | a note or interval |
| b | <code>String</code> &#124; <code>Pitch</code> | a note or interavl |

<a name="tr"></a>

## tr()
An alias for `transpose`

**Kind**: global function  
<a name="trFifths"></a>

## trFifths(tonic, number) ⇒ <code>String</code> &#124; <code>Pitch</code>
Transpose a tonic a number of perfect fifths. It can be partially applied.

**Kind**: global function  
**Returns**: <code>String</code> &#124; <code>Pitch</code> - the transposed note  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>Pitch</code> &#124; <code>String</code> |  |
| number | <code>Integer</code> | the number of times |

**Example**  
```js
import { trFifths } from 'tonal-transpose'
[0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
// or using tonal
tonal.trFifths('G4', 1) // => 'D5'
```
