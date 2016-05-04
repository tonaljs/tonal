<a name="romanRegex"></a>

## romanRegex() ⇒ <code>RegExp</code>
Returns a regex to match roman numbers literals with the from:
`[accidentals]roman[element]` where:

accidentals: (Optional) one or two flats (b) or shaprs (#)
roman: (Required) a roman numeral from I to VII either in upper or lower case
element: (Optional) a name of an element

**Kind**: global function  
**Returns**: <code>RegExp</code> - the regexp  
**Example**  
```js
r.exec('bVII')
r.exec('IVMaj7')
r.exec('ii minor')
```
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
