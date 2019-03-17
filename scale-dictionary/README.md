<a name="module_ScaleDictionary"></a>

# ScaleDictionary
A dictionary of musical scales. Query functions to get scale names,
names from intervals, and intervals from names

**Example**  
```js
import ScaleDictionary from "tonal/scale-dictionary"

ScaleDictionary.names() // => ["major", "minor", ...]
ScaleDictionary.intervalsOf("major") // => ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
ScaleDictionary.nameOf(["1P", "2M", "3M", "4P", "5P", "6M", "7M"]) // =>  "major"
```
**Example**  
```js
// with require
const { ScaleDictionary } = require("tonal")
```

* [ScaleDictionary](#module_ScaleDictionary)
    * [`.names()`](#module_ScaleDictionary.names) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.aliases()`](#module_ScaleDictionary.aliases) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.intervalsOf(name)`](#module_ScaleDictionary.intervalsOf) ⇒
    * [`.nameOf(source)`](#module_ScaleDictionary.nameOf) ⇒ <code>string</code>
    * [`.aliasesOf(name)`](#module_ScaleDictionary.aliasesOf) ⇒ <code>Array.&lt;string&gt;</code>

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
<a name="module_ScaleDictionary.intervalsOf"></a>

## `ScaleDictionary.intervalsOf(name)` ⇒
Given a scale name, return its intervals

**Kind**: static method of [<code>ScaleDictionary</code>](#module_ScaleDictionary)  
**Returns**: [Array<string>] a list of intervals or empty list if name not found  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

**Example**  
```js
ScaleDictionary.intervalsOf("major") // => ["1P", "2M", "3M", "4P", "5P", "6M", "7M"]
```
<a name="module_ScaleDictionary.nameOf"></a>

## `ScaleDictionary.nameOf(source)` ⇒ <code>string</code>
Given a list of intervals or a chroma string, return the scale name

**Kind**: static method of [<code>ScaleDictionary</code>](#module_ScaleDictionary)  
**Returns**: <code>string</code> - the scale name or undefined if not found  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Array.&lt;string&gt;</code> \| <code>string</code> | a list of intervals, a pcset chroma or a scale name |

**Example**  
```js
ScaleDictionary.nameOf(["1P", "2M", "3M", "4P", "5P", "6M", "7M"]) // => "major"
ScaleDictionary.nameOf("101011010101") // => "major"
ScaleDictionary.nameOf("ionian") // => "major"
ScaleDictionary.nameOf("major") // => "major"
```
<a name="module_ScaleDictionary.aliasesOf"></a>

## `ScaleDictionary.aliasesOf(name)` ⇒ <code>Array.&lt;string&gt;</code>
Given a scale name, return all its aliases (including the given one)

**Kind**: static method of [<code>ScaleDictionary</code>](#module_ScaleDictionary)  
**Returns**: <code>Array.&lt;string&gt;</code> - list of names or empty list if name not found  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

**Example**  
```js
ScaleDictionary.aliasesOf("blues") // => ["blues", "minor blues"]
```
