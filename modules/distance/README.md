# tonal-distance [![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)

[![tonal](https://img.shields.io/badge/tonal-distance-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-distance` is a collection of functions to find distances between music notes.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-distance`

## API Reference

<dl>
<dt><a href="#interval">interval(from, to)</a> ⇒ <code>Interval</code></dt>
<dd><p>Find distance between two pitches. Both pitches MUST be of the same type.
Distances between pitch classes always returns ascending intervals.
Distances between intervals substract one from the other.</p>
</dd>
<dt><a href="#distance">distance()</a></dt>
<dd><p>An alias for <code>distance</code></p>
</dd>
</dl>

<a name="interval"></a>

## interval(from, to) ⇒ <code>Interval</code>
Find distance between two pitches. Both pitches MUST be of the same type.
Distances between pitch classes always returns ascending intervals.
Distances between intervals substract one from the other.

**Kind**: global function  
**Returns**: <code>Interval</code> - the distance between pitches  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>Pitch</code> &#124; <code>String</code> | distance from |
| to | <code>Pitch</code> &#124; <code>String</code> | distance to |

**Example**  
```js
var tonal = require('tonal')
tonal.distance('C2', 'C3') // => 'P8'
tonal.distance('G', 'B') // => 'M3'
tonal.distance('M2', 'P5') // => 'P4'
```
<a name="distance"></a>

## distance()
An alias for `distance`

**Kind**: global function  
