## Functions

<dl>
<dt><a href="#parseRomanChord">parseRomanChord(str)</a> ⇒ <code>Object</code></dt>
<dd><p>Parse a chord expressed with roman numerals. It returns an interval representing
the root of the chord relative to the key tonic and the chord name.</p>
</dd>
<dt><a href="#progression">progression(tonic, progression)</a> ⇒ <code>Array</code></dt>
<dd><p>Get chord progression from a tonic and chord in roman numerals</p>
</dd>
</dl>

<a name="parseRomanChord"></a>

## parseRomanChord(str) ⇒ <code>Object</code>
Parse a chord expressed with roman numerals. It returns an interval representing
the root of the chord relative to the key tonic and the chord name.

**Kind**: global function  
**Returns**: <code>Object</code> - the roman number in array notation or null if not valid numeral  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the roman numeral string |

**Example**  
```js
var parse = require('music-notation/roman.parse')
parse('V7') // => { root: ['tnl', 1, 0, 0, 1], name: '7'}
parse('bIIalt') // => [ root: ['tnl', -5, 0, 2, 1], name: 'alt']
```
<a name="progression"></a>

## progression(tonic, progression) ⇒ <code>Array</code>
Get chord progression from a tonic and chord in roman numerals

**Kind**: global function  
**Returns**: <code>Array</code> - the chord progression  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> | the tonic |
| progression | <code>Array</code> &#124; <code>String</code> | the progression in roman numerals |

**Example**  
```js
var progression = require('chord-progression')
progression('I IIm7 V7', 'C') // => ['C', 'Dm7', 'G7']
```
