<a name="module_enharmonics"></a>

# enharmonics
Find and simplify enharmonic notes.

**Example**  
```js
var enharmonics = require('tonal-enharmonics')
enharmonics.find('C#4') // => ['B##3', 'C#4' 'Db4']
enharmonics.simplify('B#3') // => 'C4'
```

* [enharmonics](#module_enharmonics)
    * [`.find(note)`](#module_enharmonics.find) ⇒ <code>Array</code>
    * [`.simplify(note)`](#module_enharmonics.simplify) ⇒ <code>String</code>

<a name="module_enharmonics.find"></a>

## `enharmonics.find(note)` ⇒ <code>Array</code>
Find the enharmonics of a note. It returns an array of three elements: the
below enharmonic, the note, and the upper enharmonic

**Kind**: static method of [<code>enharmonics</code>](#module_enharmonics)  
**Returns**: <code>Array</code> - an array of notes ordered by distance to the given one  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to get the enharmonics from |

**Example**  
```js
const enharmonics = require('tonal-enharmonics')
enharmonics.find('C') // => ['B#', 'C', 'Dbb']
enharmonics.find('A') // => ['G##', 'A', 'Bbb']
enharmonics.find('C#4') // => ['B##3', 'C#4' 'Db4']
enharmonics.find('Db') // => ['C#', 'Db', 'Ebbb'])
```
<a name="module_enharmonics.simplify"></a>

## `enharmonics.simplify(note)` ⇒ <code>String</code>
Get a simpler enharmonic note name from a note, if exists

**Kind**: static method of [<code>enharmonics</code>](#module_enharmonics)  
**Returns**: <code>String</code> - the simplfiied note (if not found, return same note)  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to simplify |

**Example**  
```js
const enharmonics = require('tonal-enharmonics')
enharmonics.simplify('B#3') // => 'C4'
```
