<a name="module_RomanNumeral"></a>

# RomanNumeral
[![npm version](https://img.shields.io/npm/v/tonal-roman-numeral.svg?style=flat-square)](https://www.npmjs.com/package/tonal-roman-numeral)
[![tonal](https://img.shields.io/badge/tonal-roman-numeral-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-roman-numeral` is a collection of functions to query about tonal keys.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**  
```js
// es6
import * as RomanNumeral from "tonal-roman-numeral"
// es5
const RomanNumeral = require("tonal-roman-numeral")
```
**Example**  
```js
RomanNumeral.names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
RomanNumeral.props('ii7') // => { name: 'ii', type: '7', num: 2, major: false }
RomanNumeral.degree(2) // => "II"
RomanNumeral.degree(2, false) // => "ii"
```

* [RomanNumeral](#module_RomanNumeral)
    * [`.props()`](#module_RomanNumeral.props) ⇒ <code>Object</code>
    * [`.names([isMajor])`](#module_RomanNumeral.names) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.name(name)`](#module_RomanNumeral.name) ⇒ <code>string</code>
    * [`.type(name)`](#module_RomanNumeral.type) ⇒ <code>string</code>
    * [`.decimal(name)`](#module_RomanNumeral.decimal) ⇒ <code>number</code>
    * [`.fromDegree(degree, [isMajor])`](#module_RomanNumeral.fromDegree) ⇒ <code>string</code>

<a name="module_RomanNumeral.props"></a>

## `RomanNumeral.props()` ⇒ <code>Object</code>
Get properties of a roman numeral string

**Kind**: static method of [<code>RomanNumeral</code>](#module_RomanNumeral)  
**Returns**: <code>Object</code> - - the roman numeral properties  

| Type | Description |
| --- | --- |
| <code>string</code> | the roman numeral string (can have type, like: Imaj7) |

**Example**  
```js
props("VIIb5") // => { name: "VII", type: "b5", num: 7, major: true }
```
<a name="module_RomanNumeral.names"></a>

## `RomanNumeral.names([isMajor])` ⇒ <code>Array.&lt;String&gt;</code>
Get roman numeral names

**Kind**: static method of [<code>RomanNumeral</code>](#module_RomanNumeral)  

| Param | Type | Default |
| --- | --- | --- |
| [isMajor] | <code>boolean</code> | <code>true</code> | 

**Example**  
```js
names() // => ["I", "II", "III", "IV", "V", "VI", "VII"]
names(false) // => ["i", "ii", "iii", "iv", "v", "vi", "vii"]
```
<a name="module_RomanNumeral.name"></a>

## `RomanNumeral.name(name)` ⇒ <code>string</code>
Get roman numeral name of a string or null if not valid roman numeral

**Kind**: static method of [<code>RomanNumeral</code>](#module_RomanNumeral)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

**Example**  
```js
name('IIb7') // => 'II
name('iii') // => 'iii'
name('Ii') // => null (mixed case not allowed)
```
<a name="module_RomanNumeral.type"></a>

## `RomanNumeral.type(name)` ⇒ <code>string</code>
Get type of a roman numeral

**Kind**: static method of [<code>RomanNumeral</code>](#module_RomanNumeral)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

**Example**  
```js
type('Imaj7') // => 'maj7'
```
<a name="module_RomanNumeral.decimal"></a>

## `RomanNumeral.decimal(name)` ⇒ <code>number</code>
Get roman numeral number in decimal integer (it accepts numbers from 1 to 7)

**Kind**: static method of [<code>RomanNumeral</code>](#module_RomanNumeral)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> \| <code>number</code> | roman numeral name (with optional type) |

**Example**  
```js
decimal('IVmaj7') // => 4
decimal(4) // => 4
decimal(10) // => null
```
<a name="module_RomanNumeral.fromDegree"></a>

## `RomanNumeral.fromDegree(degree, [isMajor])` ⇒ <code>string</code>
Get a roman numeral from a degree number

**Kind**: static method of [<code>RomanNumeral</code>](#module_RomanNumeral)  
**Returns**: <code>string</code> - the roman numeral  

| Param | Type | Default |
| --- | --- | --- |
| degree | <code>number</code> |  | 
| [isMajor] | <code>boolean</code> | <code>true</code> | 

**Example**  
```js
fromDegree(2) // => "II"
fromDegree(2, false) // => "ii"
```
