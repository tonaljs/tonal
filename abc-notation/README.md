<a name="module_Abc"></a>

# Abc

Convert note strings between ABC and scientific notation

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**

```js
const Tonal = require("tonal");
Tonal.Abc.toNote("c"); // => "C5"
Tonal.Abc.toAbc("Db2"); // =>  "_D,,"
```

**Example**

```js
const { Abc } = require("tonal");
const Abc = require("tonal/abc-notation");
const { toAbc } = require("tonal/abc-notation");
```

**Example**

```js
import { Abc } from "tonal";
import * as Abc from "tonal/abc-notation";
import { toAbc } from "tonal/abc-notation";
```

- [Abc](#module_Abc)
  - [`.toNote(abcNote)`](#module_Abc.toNote) ⇒ <code>string</code>
  - [`.toAbc(note)`](#module_Abc.toAbc) ⇒ <code>string</code>

<a name="module_Abc.toNote"></a>

## `Abc.toNote(abcNote)` ⇒ <code>string</code>

Convert a (string) note in ABC notation into a (string) note in scientific notation

**Kind**: static method of [<code>Abc</code>](#module_Abc)  
**Returns**: <code>string</code> - the note in scientific notation of null if not valid

| Param   | Type                | Description              |
| ------- | ------------------- | ------------------------ |
| abcNote | <code>string</code> | the note in ABC notation |

**Example**

```js
Abc.toNote("c"); // => "C5"
```

<a name="module_Abc.toAbc"></a>

## `Abc.toAbc(note)` ⇒ <code>string</code>

Convert a (string) note in scientific notation into a (string) note in ABC notation

**Kind**: static method of [<code>Abc</code>](#module_Abc)  
**Returns**: <code>string</code> - the note in ABC notation or null if not valid note

| Param | Type                | Description                   |
| ----- | ------------------- | ----------------------------- |
| note  | <code>string</code> | a note in scientific notation |

**Example**

```js
Abc.toAbc("C#4"); // => "^C"
```
