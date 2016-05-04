<a name="build"></a>

## build(tonic, mode) ⇒ <code>Key</code>
Build a key object from tonic a mode. A key object has the following properties:
- `name` (String): the key name (i.e. 'Ab dorian'). Can be null.
- `mode` (String): the key mode (i.e. 'dorian')
- `tonic` (String): the tonic of the key (can be false)

**Kind**: global function  
**Returns**: <code>Key</code> - a key data object  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> | the key tonic |
| mode | <code>String</code> | the keymode |

**Example**  
```js
key.build('g', 'minor') // => { name: 'G minor', mode: 'minor', tonic: 'G'}
```
<a name="isKey"></a>

## isKey(obj) ⇒ <code>Boolean</code>
Test if a given object is a key data object

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if it's a key object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="hasTonic"></a>

## hasTonic(obj) ⇒ <code>Boolean</code>
Test if the given object is a key with tonic

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if it a key with tonic  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="fromAlter"></a>

## fromAlter(alt) ⇒ <code>Key</code>
Create a key from alterations

**Kind**: global function  
**Returns**: <code>Key</code> - the key object  

| Param | Type | Description |
| --- | --- | --- |
| alt | <code>Integer</code> | the alteration number (positive sharps, negative flats) |

<a name="fromAcc"></a>

## fromAcc(acc) ⇒ <code>Key</code>
Create a key from accidentals

**Kind**: global function  
**Returns**: <code>Key</code> - the key object  

| Param | Type | Description |
| --- | --- | --- |
| acc | <code>String</code> | the accidentals string |

<a name="fromName"></a>

## fromName(name) ⇒ <code>Key</code>
Create a key from key name

**Kind**: global function  
**Returns**: <code>Key</code> - the key object or null if not valid key  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the key name |

<a name="asKey"></a>

## asKey(obj) ⇒ <code>Key</code>
Try to interpret the given object as a key

**Kind**: global function  
**Returns**: <code>Key</code> - the key object or null  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

<a name="relative"></a>

## relative()
Get relative of a key

**Kind**: global function  
<a name="alteration"></a>

## alteration()
Get key alteration

**Kind**: global function  
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
<a name="alteredNotes"></a>

## alteredNotes()
Get a list of the altered notes of a given key. The notes will be in

**Kind**: global function  
