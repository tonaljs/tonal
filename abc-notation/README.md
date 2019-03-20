<a name="module_AbcNotation"></a>

# AbcNotation
Convert note names between ABC and scientific notation

**See**: https://en.wikipedia.org/wiki/ABC_notation

## Usage

```js
// ES6 modules (import)
import Abc from 'tonal/abc-notation'
Abc.toNote("c") // => "C5"
Abc.toAbc("Db2") // =>  "_D,,"
```

## API  

* [AbcNotation](#module_AbcNotation)
    * [`.toNote(abcNote)`](#module_AbcNotation.toNote) ⇒ <code>string</code>
    * [`.toAbc(note)`](#module_AbcNotation.toAbc) ⇒ <code>string</code>

<a name="module_AbcNotation.toNote"></a>

## `AbcNotation.toNote(abcNote)` ⇒ <code>string</code>
Convert a (string) note in ABC notation into a (string) note in scientific notation

**Kind**: static method of [<code>AbcNotation</code>](#module_AbcNotation)  
**Returns**: <code>string</code> - the note in scientific notation of null if not valid  

| Param | Type | Description |
| --- | --- | --- |
| abcNote | <code>string</code> | the note in ABC notation |

**Example**  
```js
AbcNotation.toNote("c") // => "C5"
```
<a name="module_AbcNotation.toAbc"></a>

## `AbcNotation.toAbc(note)` ⇒ <code>string</code>
Convert a (string) note in scientific notation into a (string) note in ABC notation

**Kind**: static method of [<code>AbcNotation</code>](#module_AbcNotation)  
**Returns**: <code>string</code> - the note in ABC notation or null if not valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | a note in scientific notation |

**Example**  
```js
AbcNotation.toAbc("C#4") // => "^C"
```
