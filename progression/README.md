<a name="module_progression"></a>

# progression
Create and manipulate chord progressions.

**Example**  
```js
var progression = require('tonal-progression')
progression.abstract('Cmaj7 Dm7 G7', 'C')
```

* [progression](#module_progression)
    * [`.abstract(chords, tonic)`](#module_progression.abstract) ⇒ <code>Array</code>
    * [`.buildRoman()`](#module_progression.buildRoman)
    * [`.concrete(tonic, progression)`](#module_progression.concrete) ⇒ <code>Array</code>
    * [`.romanRegex()`](#module_progression.romanRegex) ⇒ <code>RegExp</code>
    * [`.parseRomanChord(str)`](#module_progression.parseRomanChord) ⇒ <code>Object</code>

<a name="module_progression.abstract"></a>

## `progression.abstract(chords, tonic)` ⇒ <code>Array</code>
Given a chord progression and a tonic, return the chord progression
with roman numeral chords.

**Kind**: static method of [<code>progression</code>](#module_progression)  
**Returns**: <code>Array</code> - the chord progression in roman numerals  

| Param | Type | Description |
| --- | --- | --- |
| chords | <code>Array</code> \| <code>String</code> | the chord progression |
| tonic | <code>String</code> | the tonic |

**Example**  
```js
progression.abstract('Cmaj7 Dm7 G7', 'C') // => [ 'Imaj7', 'IIm7', 'V7' ]
```
<a name="module_progression.buildRoman"></a>

## `progression.buildRoman()`
Build an abstract chord name using roman numerals

**Kind**: static method of [<code>progression</code>](#module_progression)  
<a name="module_progression.concrete"></a>

## `progression.concrete(tonic, progression)` ⇒ <code>Array</code>
Get chord progression from a tonic and a list of chord in roman numerals

**Kind**: static method of [<code>progression</code>](#module_progression)  
**Returns**: <code>Array</code> - the chord progression  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> | the tonic |
| progression | <code>Array</code> \| <code>String</code> | the progression in roman numerals |

**Example**  
```js
var progression = require('chord-progression')
progression.concrete('I IIm7 V7', 'C') // => ['C', 'Dm7', 'G7']
```
<a name="module_progression.romanRegex"></a>

## `progression.romanRegex()` ⇒ <code>RegExp</code>
Returns a regex to match roman numbers literals with the from:
`[accidentals]roman[element]`.

The executed regex contains:

- input: the input string
- accidentals: (Optional) one or two flats (b) or shaprs (#)
- roman: (Required) a roman numeral from I to VII either in upper or lower case
- element: (Optional) a name of an element

**Kind**: static method of [<code>progression</code>](#module_progression)  
**Returns**: <code>RegExp</code> - the regexp  
**Example**  
```js
var r = progression.romanRegex()
r.exec('bVImaj7') // => ['bVImaj7', 'b', 'VI', 'maj7'])
r.exec('III dom') // => ['III dom', '', 'III', 'dom'])
```
<a name="module_progression.parseRomanChord"></a>

## `progression.parseRomanChord(str)` ⇒ <code>Object</code>
Parse a chord expressed with roman numerals. It returns an interval representing
the root of the chord relative to the key tonic and the chord name.

**Kind**: static method of [<code>progression</code>](#module_progression)  
**Returns**: <code>Object</code> - the roman chord property object with:

- type: the chord type
- root: the interval from the key to the root of this chord  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the roman numeral string |

**Example**  
```js
var parse = require('music-notation/roman.parse')
parse('V7') // => { root: '5P', type: '7' }
parse('bIIalt') // => { root: '2m', type: 'alt' }
```
