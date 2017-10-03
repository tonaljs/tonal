<a name="module_abc-notation"></a>

# abc-notation
[![npm version](https://img.shields.io/npm/v/tonal-abc-notation.svg?style=flat-square)](https://www.npmjs.com/package/tonal-abc-notation)

Convert note strings between ABC and scientific notation

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**  
```js
const abc = require('tonal-abc-notation')
abc.toNote('c') // => 'C5'
abc.toAbc('Db2') // =>  '_D,,'
```
**Example**  
```js
import tonal from 'tonal'
import { toAbc } from 'tonal-abc-notation'
tonal.scale.notes('C major').map(toAbc);
```

* [abc-notation](#module_abc-notation)
    * [`.toNote(abcNote)`](#module_abc-notation.toNote) ⇒ <code>String</code>
    * [`.toAbc(note)`](#module_abc-notation.toAbc) ⇒ <code>String</code>

<a name="module_abc-notation.toNote"></a>

## `abc-notation.toNote(abcNote)` ⇒ <code>String</code>
Convert a (string) note in ABC notation into a (string) note in scientific notation

**Kind**: static method of [<code>abc-notation</code>](#module_abc-notation)  
**Returns**: <code>String</code> - the note in scientific notation of null if not valid  

| Param | Type | Description |
| --- | --- | --- |
| abcNote | <code>String</code> | the note in ABC notation |

**Example**  
```js
abc.toNote('c') // => 'C5'
```
<a name="module_abc-notation.toAbc"></a>

## `abc-notation.toAbc(note)` ⇒ <code>String</code>
Convert a (string) note in scientific notation into a (string) note in ABC notation

**Kind**: static method of [<code>abc-notation</code>](#module_abc-notation)  
**Returns**: <code>String</code> - the note in ABC notation or null if not valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | a note in scientific notation |

**Example**  
```js
abc.toAbc('C#4') // => '^C'
```
