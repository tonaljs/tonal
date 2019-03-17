<a name="module_Range"></a>

# Range
A collection of functions to create note ranges.

**Example**  
```js
const Range = require("tonal-range")
import * as Range from "tonal-range"
```
**Example**  
```js
// ascending chromatic range
Range.chromatic(["C4", "E4"]) // => ["C4", "Db4", "D4", "Eb4", "E4"]
// descending chromatic range
Range.chromatic(["E4", "C4"]) // => ["E4", "Eb4", "D4", "Db4", "C4"]
// combining ascending and descending in complex ranges
Range.chromatic(["C2", "E2", "D2"]) // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
// numeric (midi note numbers) range
Range.numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64]
// complex numeric range
Range.numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
```

* [Range](#module_Range)
    * [`.numeric(array)`](#module_Range.numeric) ⇒ <code>Array</code>
    * [`.chromatic(list)`](#module_Range.chromatic) ⇒ <code>Array</code>
    * [`.fifths(tonic, range)`](#module_Range.fifths) ⇒ <code>Array</code>
    * [`.scale(scale, range)`](#module_Range.scale) ⇒ <code>Array</code>

<a name="module_Range.numeric"></a>

## `Range.numeric(array)` ⇒ <code>Array</code>
Create a numeric range. You supply a list of notes or numbers and it will
be conected to create complex ranges.

**Kind**: static method of [<code>Range</code>](#module_Range)  
**Returns**: <code>Array</code> - an array of numbers or empty array if not vald parameters  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | the list of notes or numbers used |

**Example**  
```js
Range.numeric(["C5", "C4"]) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
// it works midi notes
Range.numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
// complex range
Range.numeric(["C4", "E4", "Bb3"]) // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
// can be expressed with a string or array
```
<a name="module_Range.chromatic"></a>

## `Range.chromatic(list)` ⇒ <code>Array</code>
Create a range of chromatic notes. The altered notes will use flats.

**Kind**: static method of [<code>Range</code>](#module_Range)  
**Returns**: <code>Array</code> - an array of note names  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>String</code> \| <code>Array</code> | the list of notes or midi note numbers |

**Example**  
```js
Range.chromatic("C2 E2 D2") // => ["C2", "Db2", "D2", "Eb2", "E2", "Eb2", "D2"]
// with sharps
Range.chromatic("C2 C3", true) // => [ "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3" ]
```
<a name="module_Range.fifths"></a>

## `Range.fifths(tonic, range)` ⇒ <code>Array</code>
Create a range with a cycle of fifths

**Kind**: static method of [<code>Range</code>](#module_Range)  
**Returns**: <code>Array</code> - a range of cycle of fifths starting with the tonic  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> \| <code>Pitch</code> | the tonic note or pitch class |
| range | <code>Array</code> \| <code>String</code> | the range array |

**Example**  
```js
Range.fifths("C", [0, 6]) // => [ "C", "G", "D", "A", "E", "B", "F#" ])
```
<a name="module_Range.scale"></a>

## `Range.scale(scale, range)` ⇒ <code>Array</code>
Create a scale (pitch class set) Range. Given a scale (a pitch class set)
and a range array, it returns a range in notes.

Can be partially applied

**Kind**: static method of [<code>Range</code>](#module_Range)  
**Returns**: <code>Array</code> - the scale range, an empty array if not valid source or
null if not valid start or end  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>Array</code> | the scale to use or a function to convert from midi numbers to note names |
| range | <code>Array</code> | a list of notes or midi numbers |

**Example**  
```js
Range.scale("C D E F G A B", ["C3", "C2"])
// => [ "C3", "B2", "A2", "G2", "F2", "E2", "D2", "C2" ]
const majorC = Range.scale("C D E F G A B")
majorC(["C3", "C2"]) * // => [ "C3", "B2", "A2", "G2", "F2", "E2", "D2", "C2" ]
```
