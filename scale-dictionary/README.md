<a name="module_ScaleDictionary"></a>

# ScaleDictionary
A dictionary of musical scales. Query functions to get scale names,
names from intervals, and intervals from names

Probably you want to use Tonal.Scale instead of this module.

**Example**  
```js
import ScaleDictionary from "tonal/scale-dictionary"

ScaleDictionary.names() // => ["major", "minor", ...]
ScaleDictionary.getScale("major") // => {
  name: 'major',
  intervals: [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ],
  names: [ 'major', 'ionian' ],
  chroma: '101011010101',
  setnum: 2773
}
```
**Example**  
```js
// CommonJS modules (require, node.js)
const { ScaleDictionary } = require("tonal")
```

* [ScaleDictionary](#module_ScaleDictionary)
    * [`.names()`](#module_ScaleDictionary.names) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.aliases()`](#module_ScaleDictionary.aliases) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.getScale(source)`](#module_ScaleDictionary.getScale) ⇒ <code>object</code>

<a name="module_ScaleDictionary.names"></a>

## `ScaleDictionary.names()` ⇒ <code>Array.&lt;string&gt;</code>
Get all scale names without alises

**Kind**: static method of [<code>ScaleDictionary</code>](#module_ScaleDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of scale names sorted alphabetically  
**Example**  
```js
ScaleDictionary.names() // => [...]
```
<a name="module_ScaleDictionary.aliases"></a>

## `ScaleDictionary.aliases()` ⇒ <code>Array.&lt;string&gt;</code>
Get all scale names with aliases

**Kind**: static method of [<code>ScaleDictionary</code>](#module_ScaleDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of scale names sorted alphabetically  
**Example**  
```js
ScaleDictionary.aliases() // => [...]
```
<a name="module_ScaleDictionary.getScale"></a>

## `ScaleDictionary.getScale(source)` ⇒ <code>object</code>
Get a scale. The scale can be found using a name, an alias, a list
of intervals or a chroma string.

The scale object has the following fields:
- name: the scale main name
- names: a list with all possible names (including the main name)
- intervals: an array with the scale intervals
- chroma:  scale chroma
- setnum: scale chroma number

In case of not found any scale, it returns { intervals: [], aliases: [] }

**Kind**: static method of [<code>ScaleDictionary</code>](#module_ScaleDictionary)  
**Returns**: <code>object</code> - the scale object  

| Param | Type |
| --- | --- |
| source | <code>string</code> \| <code>Array.&lt;string&gt;</code> | 

