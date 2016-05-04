<a name="name"></a>

## name() ⇒ <code>String</code>
Given a note (as string or as array notation) returns a string
with the note name in scientific notation or null
if not valid note

**Kind**: global function  

| Type |
| --- |
| <code>Pitch</code> &#124; <code>String</code> | 

**Example**  
```js
import { name } from 'tonal-notes'
['c', 'db3', '2', 'g+', 'gx4'].map(name)
// => ['C', 'Db3', null, null, 'G##4']
```
<a name="pc"></a>

## pc() ⇒ <code>String</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: global function  
**Returns**: <code>String</code> - the pitch class  

| Type |
| --- |
| <code>String</code> &#124; <code>Pitch</code> | 

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
<a name="simplify"></a>

## simplify(note) ⇒ <code>String</code>
Try to get a simpler enharmonic note name

**Kind**: global function  
**Returns**: <code>String</code> - the simplfiied note (can be the same)  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to simplify |

**Example**  
```js
var enharmonics = require('enharmonics')
enharmonics.simplify('B#3') // => 'C4'
```
