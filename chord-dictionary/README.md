<a name="module_ChordDictionary"></a>

# ChordDictionary
A dictionary of musical chords.

This is a low level module. Probably you should use Tonal.Chord that
includes this module and more functionallities.

Each musical chord is represented by an object with:
- {string} - name: the main name
- {array<string>} - names: all known names (including the main name)
- {array<string>} - intervals
- {string} - chroma: the pitchclass set chroma
- {integer} - setnum: the pitchclass set chroma number in decimal

## Usage

```js
// ES6 modules (import)
import ChordDictionary from "tonal/chord-dictionary"

ChordDictionary.all() // => [{ name: aeolian, .... }, ]
ChordDictionary.find("M") // => {
  name: "major",
  quality: "Major",
  abbreviatures: ["M", ""],
  chroma: "100010010000",
  intervals: ["1P", "3M", "5P"],
  setnum: 2192
}
```

## API


* [ChordDictionary](#module_ChordDictionary)
    * [`.all()`](#module_ChordDictionary.all) ⇒ <code>array.&lt;object&gt;</code>
    * [`.find(props)`](#module_ChordDictionary.find)

<a name="module_ChordDictionary.all"></a>

## `ChordDictionary.all()` ⇒ <code>array.&lt;object&gt;</code>
Return a list of all available chords

**Kind**: static method of [<code>ChordDictionary</code>](#module_ChordDictionary)  
**Returns**: <code>array.&lt;object&gt;</code> - array of chords  
<a name="module_ChordDictionary.find"></a>

## `ChordDictionary.find(props)`
Find a chord with the given query

The query can include: name, intervals, chroma or setnum

**Kind**: static method of [<code>ChordDictionary</code>](#module_ChordDictionary)  

| Param | Type |
| --- | --- |
| props | <code>\*</code> | 

