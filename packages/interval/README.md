<a name="module_Interval"></a>

## Interval

<p><a href="https://www.npmjs.com/package/tonal-interval"><img src="https://img.shields.io/npm/v/tonal-interval.svg" alt="npm version"></a>
<a href="https://www.npmjs.com/browse/keyword/tonal"><img src="https://img.shields.io/badge/tonal-interval-yellow.svg" alt="tonal"></a></p>
<p><code>tonal-interval</code> is a collection of functions to create and manipulate music intervals.</p>
<p>The intervals are strings in shorthand notation. Two variations are supported:</p>
<ul>
<li>standard shorthand notation: type and number, for example: &quot;M3&quot;, &quot;d-4&quot;</li>
<li>inverse shorthand notation: number and then type, for example: &quot;3M&quot;, &quot;-4d&quot;</li>
</ul>
<p>The problem with the standard shorthand notation is that some strings can be
parsed as notes or intervals, for example: &quot;A4&quot; can be note A in 4th octave
or an augmented four. To remove ambiguity, the prefered notation in tonal is the
inverse shortand notation.</p>
<p>This is part of <a href="https://www.npmjs.com/package/tonal">tonal</a> music theory library.</p>
<h2>Usage</h2><pre class="prettyprint source lang-js"><code>// es6
import * as Interval from &quot;tonal-interval&quot;
// es5
const Interval = require(&quot;tonal-interval&quot;)
// part of tonal
import { Interval } from &quot;tonal&quot;

Interval.semitones(&quot;4P&quot;) // => 5
Interval.invert(&quot;3m&quot;) // => &quot;6M&quot;
Interval.simplify(&quot;9m&quot;) // => &quot;2m&quot;</code></pre><h2>Install</h2><p><a href="https://npmjs.org/package/tonal-interval/"><img src="https://nodei.co/npm/tonal-interval.png?mini=true" alt="npm install tonal-interval"></a></p>

<h2>API Documentation</h2>

- [Interval](#module_Interval)
  - _static_
    - [.num(interval)](#module_Interval.num) ⇒ <code>String</code>
    - [.name(ivl)](#module_Interval.name) ⇒ <code>Integer</code>
    - [.semitones(str)](#module_Interval.semitones) ⇒ <code>Number</code>
    - [.chroma(interval)](#module_Interval.chroma) ⇒ <code>Integer</code>
    - [.ic(props)](#module_Interval.ic) ⇒ <code>String</code>
    - [.build(interval)](#module_Interval.build) ⇒ <code>String</code>
    - [.simplify(interval)](#module_Interval.simplify) ⇒ <code>String</code>
  - _inner_
    - [~names(qualities)](#module_Interval..names) ⇒ <code>Array</code>
    - [~props(interval)](#module_Interval..props) ⇒ <code>Object</code>
    - [~num(interval)](#module_Interval..num) ⇒ <code>Integer</code>
    - [~fromSemitones(num)](#module_Interval..fromSemitones) ⇒ <code>String</code>

<a name="module_Interval.num"></a>

### Interval.num(interval) ⇒ <code>String</code>

<p>Get interval name. Can be used to test if it&quot;s an interval. It accepts intervals
as pitch or string in shorthand notation or tonal notation. It returns always
intervals in tonal notation.</p>

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>String</code> - <p>the interval name or null if not valid interval</p>

| Param    | Type                | Description                         |
| -------- | ------------------- | ----------------------------------- |
| interval | <code>String</code> | <p>the interval string or array</p> |

**Example**

```js
Interval.name("m-3"); // => "-3m"
Interval.name("3"); // => null
```

<a name="module_Interval.name"></a>

### Interval.name(ivl) ⇒ <code>Integer</code>

<p>Get size in semitones of an interval</p>

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>Integer</code> - <p>the number of semitones or null if not an interval</p>

| Param | Type                |
| ----- | ------------------- |
| ivl   | <code>String</code> |

**Example**

```js
import { semitones } from "tonal-interval";
semitones("P4"); // => 5
// or using tonal
Tonal.Interval.semitones("P5"); // => 7
```

<a name="module_Interval.semitones"></a>

### Interval.semitones(str) ⇒ <code>Number</code>

<p>Get the chroma of the interval. The chroma is a number between 0 and 7
that represents the position within an octave (pitch set)</p>

**Kind**: static method of [<code>Interval</code>](#module_Interval)

| Param | Type                |
| ----- | ------------------- |
| str   | <code>String</code> |

<a name="module_Interval.chroma"></a>

### Interval.chroma(interval) ⇒ <code>Integer</code>

<p>Get the <a href="https://en.wikipedia.org/wiki/Interval_class">interval class</a>
number of a given interval.</p>
<p>In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes</p>

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>Integer</code> - <p>A value between 0 and 6</p>

| Param    | Type                                        | Description                                    |
| -------- | ------------------------------------------- | ---------------------------------------------- |
| interval | <code>String</code> \| <code>Integer</code> | <p>the interval or the number of semitones</p> |

**Example**

```js
Interval.ic("P8"); // => 0
Interval.ic("m6"); // => 4
Interval.ic(10) // => 2
  [("P1", "M2", "M3", "P4", "P5", "M6", "M7")].map(ic); // => [0, 2, 4, 5, 5, 3, 1]
```

<a name="module_Interval.ic"></a>

### Interval.ic(props) ⇒ <code>String</code>

<p>Given a interval property object, get the interval name</p>
<p>The properties must contain a <code>num</code> <em>or</em> <code>step</code>, and <code>alt</code>:</p>
<ul>
<li>num: the interval number</li>
<li>step: the interval step (overrides the num property)</li>
<li>alt: the interval alteration</li>
<li>oct: (Optional) the number of octaves</li>
<li>dir: (Optional) the direction</li>
</ul>

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>String</code> - <p>the interval name</p>

| Param | Type                | Description                         |
| ----- | ------------------- | ----------------------------------- |
| props | <code>Object</code> | <p>the interval property object</p> |

**Example**

```js
Interval.build({ step: 1, alt: -1, oct: 0, dir: 1 }); // => "1d"
Interval.build({ num: 9, alt: -1 }); // => "9m"
```

<a name="module_Interval.build"></a>

### Interval.build(interval) ⇒ <code>String</code>

<p>Get the simplified version of an interval.</p>

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>String</code> - <p>the simplified interval</p>

| Param    | Type                | Description                     |
| -------- | ------------------- | ------------------------------- |
| interval | <code>String</code> | <p>the interval to simplify</p> |

**Example**

```js
Interval.simplify("9M") // => "2M"
  [("8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P")].map(
    Interval.simplify
  );
// => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
Interval.simplify("2M"); // => "2M"
Interval.simplify("-2M"); // => "7m"
```

<a name="module_Interval.simplify"></a>

### Interval.simplify(interval) ⇒ <code>String</code>

<p>Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
of an interval.</p>

**Kind**: static method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>String</code> - <p>the inverted interval</p>

| Param    | Type                | Description                                                                             |
| -------- | ------------------- | --------------------------------------------------------------------------------------- |
| interval | <code>String</code> | <p>the interval to invert in interval shorthand notation or interval array notation</p> |

**Example**

```js
Interval.invert("3m"); // => "6M"
Interval.invert("2M"); // => "7m"
```

<a name="module_Interval..names"></a>

### Interval~names(qualities) ⇒ <code>Array</code>

<p>List basic (perfect, major, minor) interval names within a octave</p>

**Kind**: inner method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>Array</code> - <p>the interval names</p>

| Param     | Type                | Description                                                |
| --------- | ------------------- | ---------------------------------------------------------- |
| qualities | <code>String</code> | <p>(Optional, default &quot;PMm&quot;) the valid types</p> |

**Example**

```js
Interval.names(); // => [ "1P", "2m", "2M", "3m", "3M", "4P", "5P", "6m", "6M", "7m", "7M", "8P" ]
Interval.names("P"); // => [ "1P", "4P", "5P", "8P" ]
Interval.names("PM"); // => [ "1P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
Interval.names("Pm"); // => [ "1P", "2m", "3m", "4P", "5P", "6m", "7m", "8P" ]
Interval.names("d"); // => []
```

<a name="module_Interval..props"></a>

### Interval~props(interval) ⇒ <code>Object</code>

<p>Get interval properties. It returns an object with:</p>
<ul>
<li>name: name</li>
<li>num: number</li>
<li>q: quality</li>
<li>step: step</li>
<li>alt: alteration</li>
<li>dir: direction (1 ascending, -1 descending)</li>
<li>type: &quot;P&quot; or &quot;M&quot; for perfectable or majorable</li>
<li>simple: the simplified number</li>
<li>semitones: the size in semitones</li>
<li>chroma: the interval chroma</li>
<li>ic: the interval class</li>
</ul>

**Kind**: inner method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>Object</code> - <p>the interval in the form [number, alt]</p>

| Param    | Type                | Description         |
| -------- | ------------------- | ------------------- |
| interval | <code>String</code> | <p>the interval</p> |

<a name="module_Interval..num"></a>

### Interval~num(interval) ⇒ <code>Integer</code>

<p>Get the number of the interval</p>

**Kind**: inner method of [<code>Interval</code>](#module_Interval)

| Param    | Type                | Description         |
| -------- | ------------------- | ------------------- |
| interval | <code>String</code> | <p>the interval</p> |

**Example**

```js
Interval.num("m2"); // => 2
Interval.num("P9"); // => 9
Interval.num("P-4"); // => -4
```

<a name="module_Interval..fromSemitones"></a>

### Interval~fromSemitones(num) ⇒ <code>String</code>

<p>Get interval name from semitones number. Since there are several interval
names for the same number, the name it&quot;s arbitraty, but deterministic.</p>

**Kind**: inner method of [<code>Interval</code>](#module_Interval)  
**Returns**: <code>String</code> - <p>the interval name</p>

| Param | Type                 | Description                                      |
| ----- | -------------------- | ------------------------------------------------ |
| num   | <code>Integer</code> | <p>the number of semitones (can be negative)</p> |

**Example**

```js
import { fromSemitones } from "tonal-interval";
fromSemitones(7); // => "5P"
// or using tonal
Tonal.Distance.fromSemitones(-7); // => "-5P"
```
