## Functions

<dl>
<dt><a href="#isMidi">isMidi(num)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if the given number is a valid midi note number</p>
</dd>
<dt><a href="#midi">midi(pitch)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get midi number for a pitch</p>
</dd>
<dt><a href="#wellTempered">wellTempered(ref)</a> ⇒ <code>function</code></dt>
<dd><p>Get a frequency calculator function that uses well temperament and a tuning reference.</p>
</dd>
<dt><a href="#toFreq">toFreq(pitch)</a> ⇒ <code>Float</code></dt>
<dd><p>Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz</p>
</dd>
<dt><a href="#listArr">listArr(source)</a> ⇒ <code>Array</code></dt>
<dd><p>Split a string by spaces (or commas or bars). Always returns an array, even if its empty</p>
</dd>
</dl>

<a name="isMidi"></a>

## isMidi(num) ⇒ <code>Boolean</code>
Test if the given number is a valid midi note number

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if it's a valid midi note number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Object</code> | the number to test |

<a name="midi"></a>

## midi(pitch) ⇒ <code>Integer</code>
Get midi number for a pitch

**Kind**: global function  
**Returns**: <code>Integer</code> - the midi number or null if not valid pitch  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch |

**Example**  
```js
midi('C4') // => 60
```
<a name="wellTempered"></a>

## wellTempered(ref) ⇒ <code>function</code>
Get a frequency calculator function that uses well temperament and a tuning reference.

**Kind**: global function  
**Returns**: <code>function</code> - the frequency calculator. It accepts a pitch in array or scientific notation and returns the frequency in herzs.  

| Param | Type | Description |
| --- | --- | --- |
| ref | <code>Float</code> | the tuning reference |

<a name="toFreq"></a>

## toFreq(pitch) ⇒ <code>Float</code>
Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz

**Kind**: global function  
**Returns**: <code>Float</code> - the frequency in herzs  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch to get the frequency from |

**Example**  
```js
toFreq('C4') // => 261.6255653005986
```
<a name="listArr"></a>

## listArr(source) ⇒ <code>Array</code>
Split a string by spaces (or commas or bars). Always returns an array, even if its empty

**Kind**: global function  
**Returns**: <code>Array</code> - the object as an array  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> &#124; <code>Array</code> &#124; <code>Object</code> | the thing to get an array from |

