<a name="module_Abc"></a>

# Abc
[![npm version](https://img.shields.io/npm/v/tonal-abc-notation.svg?style=flat-square)](https://www.npmjs.com/package/tonal-abc-notation)

Convert note strings between ABC and scientific notation

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**  
```js
const Abc = require("tonal-abc-notation")
Abc.toNote("c") // => "C5"
Abc.toAbc("Db2") // =>  "_D,,"
```
**Example**  
```js
import Tonal from "tonal"
import { toAbc } from "tonal-abc-notation"
Tonal.Scale.notes("C major").map(toAbc);
```

* [Abc](#module_Abc)
    * [`.toNote(abcNote)`](#module_Abc.toNote) ⇒ <code>String</code>
    * [`.toAbc(note)`](#module_Abc.toAbc) ⇒ <code>String</code>

<a name="module_Abc.toNote"></a>

## `Abc.toNote(abcNote)` ⇒ <code>String</code>
Convert a (string) note in ABC notation into a (string) note in scientific notation

**Kind**: static method of [<code>Abc</code>](#module_Abc)  
**Returns**: <code>String</code> - the note in scientific notation of null if not valid  

| Param | Type | Description |
| --- | --- | --- |
| abcNote | <code>String</code> | the note in ABC notation |

**Example**  
```js
Abc.toNote("c") // => "C5"
```
<a name="module_Abc.toAbc"></a>

## `Abc.toAbc(note)` ⇒ <code>String</code>
Convert a (string) note in scientific notation into a (string) note in ABC notation

**Kind**: static method of [<code>Abc</code>](#module_Abc)  
**Returns**: <code>String</code> - the note in ABC notation or null if not valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | a note in scientific notation |

**Example**  
```js
abc.toAbc("C#4") // => "^C"
```
