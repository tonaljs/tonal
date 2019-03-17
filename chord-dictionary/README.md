<a name="module_ChordDictionary"></a>

# ChordDictionary
A dictionary of musical chords. Query functions to get chord names and abbreviations
chord name from intervals, and intervals from chord name

**Example**  
```js
import ChordDictionary from "tonal/chord-dictionary"

ChordDictionary.intervals("major") // => ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
ChordDictionary.names() // => ["major", "minor", ...]
```
**Example**  
```js
// with require
const { ChordDictionary } = require("tonal")
```

* [ChordDictionary](#module_ChordDictionary)
    * [`.names()`](#module_ChordDictionary.names) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.abbreviations()`](#module_ChordDictionary.abbreviations) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.aliases()`](#module_ChordDictionary.aliases) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.nameOf(symbol)`](#module_ChordDictionary.nameOf) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.abbreviationsOf(source)`](#module_ChordDictionary.abbreviationsOf) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.intervalsOf(symbol)`](#module_ChordDictionary.intervalsOf) ⇒ <code>Array.&lt;string&gt;</code>

<a name="module_ChordDictionary.names"></a>

## `ChordDictionary.names()` ⇒ <code>Array.&lt;string&gt;</code>
Get chord names

**Kind**: static method of [<code>ChordDictionary</code>](#module_ChordDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of chord names sorted alphabetically  
**Example**  
```js
ChordDictionary.names() // => [...]
```
<a name="module_ChordDictionary.abbreviations"></a>

## `ChordDictionary.abbreviations()` ⇒ <code>Array.&lt;string&gt;</code>
Get all chord abbreviations (without abbreviation alises)
It returns one abbreviation for each different chord

**Kind**: static method of [<code>ChordDictionary</code>](#module_ChordDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of chord abbreviations sorted alphabetically  
**Example**  
```js
ChordDictionary.abbreviations() // => [...]
```
<a name="module_ChordDictionary.aliases"></a>

## `ChordDictionary.aliases()` ⇒ <code>Array.&lt;string&gt;</code>
Get all chord names with all chord abbreviations (including aliases)
Basically it returns a list of all known names and abbreviations

**Kind**: static method of [<code>ChordDictionary</code>](#module_ChordDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of chord names sorted alphabetically  
**Example**  
```js
ChordDictionary.aliases() // => [...]
```
<a name="module_ChordDictionary.nameOf"></a>

## `ChordDictionary.nameOf(symbol)` ⇒ <code>Array.&lt;string&gt;</code>
Given a chord symbol (name or abbreviation), return the name

**Kind**: static method of [<code>ChordDictionary</code>](#module_ChordDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - list of names or empty list if name not found  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | chord name or abbreviation |

**Example**  
```js
ChordDictionary.nameOf("M") // => "major seventh"
ChordDictionary.nameOf("major seventh") // => "major seventh"
```
<a name="module_ChordDictionary.abbreviationsOf"></a>

## `ChordDictionary.abbreviationsOf(source)` ⇒ <code>Array.&lt;string&gt;</code>
Given a chord symbol (name or abbreviation), return all known abbreviations

**Kind**: static method of [<code>ChordDictionary</code>](#module_ChordDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - list of names or empty list if name not found  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Array.&lt;String&gt;</code> \| <code>string</code> | chord intervals, chroma, name or abbreviation |

**Example**  
```js
ChordDictionary.abbreviationsOf("major seventh") // => ['maj7', 'Δ', 'ma7', 'M7', 'Maj7']
ChordDictionary.abbreviationsOf("maj7") // => ['maj7', 'Δ', 'ma7', 'M7', 'Maj7']
```
<a name="module_ChordDictionary.intervalsOf"></a>

## `ChordDictionary.intervalsOf(symbol)` ⇒ <code>Array.&lt;string&gt;</code>
Given a chord name or abbreviation, return its intervals

**Kind**: static method of [<code>ChordDictionary</code>](#module_ChordDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - a list of intervals or empty list if name not found  

| Param | Type | Description |
| --- | --- | --- |
| symbol | <code>string</code> | name or abbreviation |

**Example**  
```js
ChordDictionary.intervalsOf("M") // => ["1P", "3M", "5P"]
ChordDictionary.intervalsOf("major seventh") // => ["1P", "3M", "5P", "7M"]
ChordDictionary.intervalsOf("maj7") // => ["1P", "3M", "5P", "7M"]
ChordDictionary.intervalsOf("Δ") // => ["1P", "3M", "5P", "7M"]
```
