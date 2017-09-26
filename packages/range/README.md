<a name="module_range"></a>

# range
A collection of functions to create note ranges.

**Example**  
```js
var range = require('tonal-range')
// ascending chromatic range
range.chromatic(['C4', 'E4']) // => ['C4', 'Db4', 'D4', 'Eb4', 'E4']
// descending chromatic range
range.chromatic(['E4', 'C4']) // => ['E4', 'Eb4', 'D4', 'Db4', 'C4']
// combining ascending and descending in complex ranges
range.chromatic(['C2', 'E2', 'D2']) // => ['C2', 'Db2', 'D2', 'Eb2', 'E2', 'Eb2', 'D2']
// numeric (midi note numbers) range
range.numeric('C4 E4 Bb3') // => [60, 61, 62, 63, 64]
// complex numeric range
range.numeric('C4 E4 Bb3') // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
// create a scale range
range.pitchSet('c e g a', 'c2 c3 c2') // => [ 'C2', 'E2', 'G2', 'A2', 'C3', 'A2', 'G2', 'E2', 'C2' ] *
 g
```

* [range](#module_range)
    * [`.numeric(list)`](#module_range.numeric) ⇒ <code>Array</code>
    * [`.chromatic(list)`](#module_range.chromatic) ⇒ <code>Array</code>
    * [`.fifths(tonic, range)`](#module_range.fifths) ⇒ <code>Array</code>
    * [`.pitchSet(scale, range)`](#module_range.pitchSet) ⇒ <code>Array</code>

<a name="module_range.numeric"></a>

## `range.numeric(list)` ⇒ <code>Array</code>
Create a numeric range. You supply a list of notes or numbers and it will
be conected to create complex ranges.

**Kind**: static method of [<code>range</code>](#module_range)  
**Returns**: <code>Array</code> - an array of numbers or empty array if not vald parameters  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>String</code> \| <code>Array</code> | the list of notes or numbers used |

**Example**  
```js
range.numeric(["C5", "C4']) // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
// it works midi notes
range.numeric([10, 5]) // => [ 10, 9, 8, 7, 6, 5 ]
// complex range
range.numeric('C4 E4 Bb3') // => [60, 61, 62, 63, 64, 63, 62, 61, 60, 59, 58]
// can be expressed with a string or array
range.numeric('C2 C4 C2') === range.numeric(['C2', 'C4', 'C2'])
```
<a name="module_range.chromatic"></a>

## `range.chromatic(list)` ⇒ <code>Array</code>
Create a range of chromatic notes. The altered notes will use flats.

**Kind**: static method of [<code>range</code>](#module_range)  
**Returns**: <code>Array</code> - an array of note names  

| Param | Type | Description |
| --- | --- | --- |
| list | <code>String</code> \| <code>Array</code> | the list of notes or midi note numbers |

**Example**  
```js
tonal.chromatic('C2 E2 D2') // => ['C2', 'Db2', 'D2', 'Eb2', 'E2', 'Eb2', 'D2']
// with sharps
tonal.chromatic('C2 C3', true) // => [ 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3' ]
```
<a name="module_range.fifths"></a>

## `range.fifths(tonic, range)` ⇒ <code>Array</code>
Create a range with a cycle of fifths

**Kind**: static method of [<code>range</code>](#module_range)  
**Returns**: <code>Array</code> - a range of cycle of fifths starting with the tonic  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> \| <code>Pitch</code> | the tonic note or pitch class |
| range | <code>Array</code> \| <code>String</code> | the range array |

**Example**  
```js
range.fifths('C', [0, 6]) // => [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
```
<a name="module_range.pitchSet"></a>

## `range.pitchSet(scale, range)` ⇒ <code>Array</code>
Create a pitch set (scale or chord) range. Given a pitch set (a collection
of pitch classes), and a range array, it returns a range in notes.

**Kind**: static method of [<code>range</code>](#module_range)  
**Returns**: <code>Array</code> - the scale range, an empty array if not valid source or
null if not valid start or end  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>String</code> \| <code>Array</code> \| <code>function</code> | the scale to use or a function to convert from midi numbers to note names |
| range | <code>String</code> \| <code>Array</code> | a list of notes or midi numbers |

**Example**  
```js
range.pitchSet('C D E F G A B', ['C3', 'C2'])
// => [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ]
```
