<a name="module_ScaleDictionary"></a>

# ScaleDictionary
A dictionary of musical scales.

This is a low level module. Probably you should use Tonal.Scale that
includes this module and more functionallities.

Each musical scale is represented by an object with:
- {string} - name: the main name
- {array<string>} - names: all known names (including the main name)
- {array<string>} - intervals
- {string} - chroma: the pitchclass set chroma
- {integer} - setnum: the pitchclass set chroma number in decimal

**Example**  
```js
import ScaleDictionary from "tonal/scale-dictionary"

ScaleDictionary.all() // => [{ name: aeolian, .... }, ]
ScaleDictionary.find("major") // => {
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
    * [`.all()`](#module_ScaleDictionary.all) ⇒ <code>array.&lt;object&gt;</code>
    * [`.find(props)`](#module_ScaleDictionary.find)

<a name="module_ScaleDictionary.all"></a>

## `ScaleDictionary.all()` ⇒ <code>array.&lt;object&gt;</code>
Return a list of all available scales

**Kind**: static method of [<code>ScaleDictionary</code>](#module_ScaleDictionary)  
**Returns**: <code>array.&lt;object&gt;</code> - array of scales  
<a name="module_ScaleDictionary.find"></a>

## `ScaleDictionary.find(props)`
Find a scale with the given query

The query can include: name, intervals, chroma or setnum

**Kind**: static method of [<code>ScaleDictionary</code>](#module_ScaleDictionary)  

| Param | Type |
| --- | --- |
| props | <code>\*</code> | 

