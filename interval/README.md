<a name="module_Interval"></a>

# Interval
A collection of functions to create and manipulate music intervals.

The intervals are strings in shorthand notation. Two variations are supported:

- standard shorthand notation: type and number, for example: "M3", "d-4"
- inverse shorthand notation: number and then type, for example: "3M", "-4d"

The problem with the standard shorthand notation is that some strings can be
parsed as notes or intervals, for example: "A4" can be note A in 4th octave
or an augmented four. To remove ambiguity, the prefered notation in tonal is the
inverse shortand notation.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

With Es6 modules:

```js
import Interval from "tonal/interval"
Interval.semitones("4P") // => 5
Interval.invert("3m") // => "6M"
Interval.simplify("9m") // => "2m"
```

ES5 modules:

```js
const Tonal = require('tonal')
Tonal.Interval.semitones("4P") // => 5
```

## API


* [Interval](#module_Interval)
    * [`.names(qualities)`](#module_Interval.names) ⇒ <code>Array</code>
    * [`.tokenize(interval)`](#module_Interval.tokenize) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.props(interval)`](#module_Interval.props) ⇒ <code>Object</code>
    * [`.num(interval)`](#module_Interval.num) ⇒ <code>Integer</code>
    * [`.name(interval)`](#module_Interval.name) ⇒ <code>string</code>
    * [`.semitones(ivl)`](#module_Interval.semitones) ⇒ <code>Integer</code>
    * [`.chroma(str)`](#module_Interval.chroma) ⇒ <code>number</code>
    * [`.ic(interval)`](#module_Interval.ic) ⇒ <code>Integer</code>
    * [`.fromProps(props)`](#module_Interval.fromProps) ⇒ <code>string</code>
    * [`.simplify(interval)`](#module_Interval.simplify) ⇒ <code>string</code>
    * [`.invert(interval)`](#module_Interval.invert) ⇒ <code>string</code>
    * [`.fromSemitones(num)`](#module_Interval.fromSemitones) ⇒ <code>string</code>

<a name="module_Interval.names"></a>

## `Interval.names(qualities)` ⇒ <code>Array</code>
List basic (perfect, major, minor) interval names within a octave

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>Array</code> - the interval names  

| Param | Type | Description |
| --- | --- | --- |
| qualities | <code>string</code> | (Optional, default "PMm") the valid types |

**Example**  
```js
Interval.names() // => [ "1P", "2m", "2M", "3m", "3M", "4P", "5P", "6m", "6M", "7m", "7M", "8P" ]
Interval.names("P") // => [ "1P", "4P", "5P", "8P" ]
Interval.names("PM") // => [ "1P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
Interval.names("Pm") // => [ "1P", "2m", "3m", "4P", "5P", "6m", "7m", "8P" ]
Interval.names("d") // => []
```
<a name="module_Interval.tokenize"></a>

## `Interval.tokenize(interval)` ⇒ <code>Array.&lt;String&gt;</code>
Split a interval string into its parts

It returns an array with the shape [number, type]

**Kind**: static method of [<code>Interval</code>](#module_Interval)  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>string</code> | the interval string |

**Example**  
```js
Interval.tokenize("-2M") //=> ["-2", "M"]
```
<a name="module_Interval.props"></a>

## `Interval.props(interval)` ⇒ <code>Object</code>
Get interval properties. It returns an object with:

- name: name
- num: number
- q: quality
- step: step
- alt: alteration
- dir: direction (1 ascending, -1 descending)
- type: "P" or "M" for perfectable or majorable
- simple: the simplified number
- semitones: the size in semitones
- chroma: the interval chroma
- ic: the interval class

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>Object</code> - the interval in the form [number, alt]  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>string</code> | the interval |

<a name="module_Interval.num"></a>

## `Interval.num(interval)` ⇒ <code>Integer</code>
Get the number of the interval

**Kind**: static method of [<code>Interval</code>](#module_Interval)  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>string</code> | the interval |

**Example**  
```js
Interval.num("m2") // => 2
Interval.num("P9") // => 9
Interval.num("P-4") // => -4
```
<a name="module_Interval.name"></a>

## `Interval.name(interval)` ⇒ <code>string</code>
Get interval name. Can be used to test if it"s an interval. It accepts intervals
as pitch or string in shorthand notation or tonal notation. It returns always
intervals in tonal notation.

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>string</code> - the interval name or null if not valid interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>string</code> | the interval string or array |

**Example**  
```js
Interval.name("m-3") // => "-3m"
Interval.name("3") // => null
```
<a name="module_Interval.semitones"></a>

## `Interval.semitones(ivl)` ⇒ <code>Integer</code>
Get size in semitones of an interval

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>Integer</code> - the number of semitones or null if not an interval  

| Param | Type |
| --- | --- |
| ivl | <code>string</code> | 

**Example**  
```js
import { semitones } from "tonal-interval"
semitones("P4") // => 5
// or using tonal
Tonal.Interval.semitones("P5") // => 7
```
<a name="module_Interval.chroma"></a>

## `Interval.chroma(str)` ⇒ <code>number</code>
Get the chroma of the interval. The chroma is a number between 0 and 7
that represents the position within an octave (pitch set)

**Kind**: static method of [<code>Interval</code>](#module_Interval)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

<a name="module_Interval.ic"></a>

## `Interval.ic(interval)` ⇒ <code>Integer</code>
Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
number of a given interval.

In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>Integer</code> - A value between 0 and 6  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Integer</code> | the interval or the number of semitones |

**Example**  
```js
Interval.ic("P8") // => 0
Interval.ic("m6") // => 4
Interval.ic(10) // => 2
["P1", "M2", "M3", "P4", "P5", "M6", "M7"].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
```
<a name="module_Interval.fromProps"></a>

## `Interval.fromProps(props)` ⇒ <code>string</code>
Given a interval props object, get the interval name

The properties must contain a `num` *or* `step`, and `alt`:

- num: the interval number
- step: the interval step (overrides the num property)
- alt: the interval alteration
- oct: (Optional) the number of octaves
- dir: (Optional) the direction

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>string</code> - the interval name  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | the interval property object |

**Example**  
```js
Interval.fromProps({ step: 1, alt: -1, oct: 0, dir: 1 }) // => "1d"
Interval.fromProps({ num: 9, alt: -1 }) // => "9m"
```
<a name="module_Interval.simplify"></a>

## `Interval.simplify(interval)` ⇒ <code>string</code>
Get the simplified version of an interval.

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>string</code> - the simplified interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>string</code> | the interval to simplify |

**Example**  
```js
Interval.simplify("9M") // => "2M"
["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
// => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
Interval.simplify("2M") // => "2M"
Interval.simplify("-2M") // => "7m"
```
<a name="module_Interval.invert"></a>

## `Interval.invert(interval)` ⇒ <code>string</code>
Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
of an interval.

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>string</code> - the inverted interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>string</code> | the interval to invert in interval shorthand notation or interval array notation |

**Example**  
```js
Interval.invert("3m") // => "6M"
Interval.invert("2M") // => "7m"
```
<a name="module_Interval.fromSemitones"></a>

## `Interval.fromSemitones(num)` ⇒ <code>string</code>
Get interval name from semitones number. Since there are several interval
names for the same number, the name it"s arbitraty, but deterministic.

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>string</code> - the interval name  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Integer</code> | the number of semitones (can be negative) |

**Example**  
```js
import { fromSemitones } from "tonal-interval"
fromSemitones(7) // => "5P"
// or using tonal
Tonal.Distance.fromSemitones(-7) // => "-5P"
```
