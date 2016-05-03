## Functions

<dl>
<dt><a href="#transpose">transpose()</a></dt>
<dd><p>Transpose notes. Can be used to add intervals</p>
</dd>
<dt><a href="#tr">tr()</a></dt>
<dd><p>Transpose notes. An alias for <code>transpose</code></p>
</dd>
<dt><a href="#interval">interval(from, to)</a> ⇒ <code>Interval</code></dt>
<dd><p>Find distance between two pitches. Both pitches MUST be of the same type.
Distances between pitch classes always returns ascending intervals.
Distances between intervals substract one from the other.</p>
</dd>
<dt><a href="#distance">distance()</a></dt>
<dd><p>An alias for <code>distance</code></p>
</dd>
<dt><a href="#dist">dist()</a></dt>
<dd><p>An alias for <code>distance</code></p>
</dd>
<dt><a href="#fifthsFrom">fifthsFrom(tonic, number)</a> ⇒ <code>String</code> | <code>Pitch</code></dt>
<dd><p>Transpose a tonic a number of perfect fifths.</p>
</dd>
</dl>

<a name="transpose"></a>

## transpose()
Transpose notes. Can be used to add intervals

**Kind**: global function  
<a name="tr"></a>

## tr()
Transpose notes. An alias for `transpose`

**Kind**: global function  
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
<a name="dist"></a>

## dist()
An alias for `distance`

**Kind**: global function  
<a name="fifthsFrom"></a>

## fifthsFrom(tonic, number) ⇒ <code>String</code> &#124; <code>Pitch</code>
Transpose a tonic a number of perfect fifths.

**Kind**: global function  
**Returns**: <code>String</code> &#124; <code>Pitch</code> - the transposed note  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>Pitch</code> &#124; <code>String</code> |  |
| number | <code>Integer</code> | the number of times |

