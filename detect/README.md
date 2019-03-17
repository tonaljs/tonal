<a name="module_Detect"></a>

# Detect
[![npm version](https://img.shields.io/npm/v/tonal-detect.svg?style=flat-square)](https://www.npmjs.com/package/tonal-detect)

Find chord and scale names from a collection of notes or pitch classes

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**  
```js
import { chord } from "tonal-detect"
chord(["C", "E", "G", "A"]) // => ["CM6", "Am7"]
```
**Example**  
```js
const Detect = require("tonal-detect")
Detect.chord(["C", "E", "G", "A"]) // => ["CM6", "Am7"]
```

* [Detect](#module_Detect)
    * [`.chord(notes)`](#module_Detect.chord) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.scale(notes)`](#module_Detect.scale) ⇒ <code>Array.&lt;String&gt;</code>

<a name="module_Detect.chord"></a>

## `Detect.chord(notes)` ⇒ <code>Array.&lt;String&gt;</code>
Given a collection of notes or pitch classes, try to find the chord name

**Kind**: static method of [<code>Detect</code>](#module_Detect)  
**Returns**: <code>Array.&lt;String&gt;</code> - chord names or empty array  

| Param | Type |
| --- | --- |
| notes | <code>Array.&lt;String&gt;</code> | 

**Example**  
```js
Detect.chord(["C", "E", "G", "A"]) // => ["CM6", "Am7"]
```
<a name="module_Detect.scale"></a>

## `Detect.scale(notes)` ⇒ <code>Array.&lt;String&gt;</code>
Given a collection of notes or pitch classes, try to find the scale names

**Kind**: static method of [<code>Detect</code>](#module_Detect)  
**Returns**: <code>Array.&lt;String&gt;</code> - scale names or empty array  

| Param | Type |
| --- | --- |
| notes | <code>Array.&lt;String&gt;</code> | 

**Example**  
```js
Detect.scale(["f3", "a", "c5", "e2", "d", "g2", "b6"]) // => [
"C major",
"D dorian",
"E phrygian",
"F lydian",
"G mixolydian",
"A aeolian",
"B locrian"
]
```
