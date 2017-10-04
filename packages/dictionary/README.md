<a name="module_Dictionary"></a>

# Dictionary
[![npm version](https://img.shields.io/npm/v/tonal-dictionary.svg)](https://www.npmjs.com/package/tonal-dictionary)

`tonal-dictionary` contains a dictionary of musical scales and chords

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**  
```js
// es6
import * as Dictionary from "tonal-dictionary"
// es5
const Dictionary = require("tonal-dictionary")
```
**Example**  
```js
Dictionary.chord("Maj7") // => ["1P", "3M", "5P", "7M"]
```

* [Dictionary](#module_Dictionary)
    * [`.scale(name)`](#module_Dictionary.scale) ⇒ <code>Array</code>
    * [`.chord(type)`](#module_Dictionary.chord) ⇒ <code>Array</code>

<a name="module_Dictionary.scale"></a>

## `Dictionary.scale(name)` ⇒ <code>Array</code>
A dictionary of scales: a function that given a scale name (without tonic)
returns an array of intervals

**Kind**: static method of [<code>Dictionary</code>](#module_Dictionary)  
**Returns**: <code>Array</code> - intervals  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

**Example**  
```js
import { scale } from "tonal-dictionary"
scale("major") // => ["1P", "2M", ...]
scale.names(); // => ["major", ...]
```
<a name="module_Dictionary.chord"></a>

## `Dictionary.chord(type)` ⇒ <code>Array</code>
A dictionary of chords: a function that given a chord type
returns an array of intervals

**Kind**: static method of [<code>Dictionary</code>](#module_Dictionary)  
**Returns**: <code>Array</code> - intervals  

| Param | Type |
| --- | --- |
| type | <code>String</code> | 

**Example**  
```js
import { chord } from "tonal-dictionary"
chord("Maj7") // => ["1P", "3M", ...]
chord.names(); // => ["Maj3", ...]
```
