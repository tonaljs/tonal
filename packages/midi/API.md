## Functions

<dl>
<dt><a href="#isMidi">isMidi(num)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if the given number is a valid midi note number</p>
</dd>
<dt><a href="#toMidi">toMidi(pitch)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get midi number for a pitch</p>
</dd>
<dt><a href="#fromMidi">fromMidi(midi)</a> ⇒ <code>String</code></dt>
<dd><p>Given a midi number, returns a note name. The altered notes will have
flats.</p>
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

<a name="toMidi"></a>

## toMidi(pitch) ⇒ <code>Integer</code>
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
<a name="fromMidi"></a>

## fromMidi(midi) ⇒ <code>String</code>
Given a midi number, returns a note name. The altered notes will have
flats.

**Kind**: global function  
**Returns**: <code>String</code> - the note name  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>Integer</code> | the midi note number |

**Example**  
```js
tonal.fromMidi(61) // => 'Db4'
```
