# tonal-scale [![npm version](https://img.shields.io/npm/v/tonal-scale.svg)](https://www.npmjs.com/package/tonal-scale)

[![tonal](https://img.shields.io/badge/tonal-scale-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-scale` is a collection of functions to create and manipulate music scales.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-scale`

## API Reference

<dl>
<dt><a href="#build">build(source, tonic)</a> ⇒ <code>Array</code></dt>
<dd><p>Create scales by scale type or intervals and tonic. The returned scale is an
array of notes (or intervals if you specify <code>false</code> as tonic)</p>
<p>This function is currified</p>
</dd>
<dt><a href="#names">names(aliases)</a> ⇒ <code>Array</code></dt>
<dd><p>Return the available scale names</p>
</dd>
<dt><a href="#get">get(name)</a> ⇒ <code>Array</code></dt>
<dd><p>Get scale notes from scale name</p>
</dd>
</dl>

<a name="build"></a>

## build(source, tonic) ⇒ <code>Array</code>
Create scales by scale type or intervals and tonic. The returned scale is an
array of notes (or intervals if you specify `false` as tonic)

This function is currified

**Kind**: global function  
**Returns**: <code>Array</code> - the scale notes  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> | the scale type, intervals or notes |
| tonic | <code>String</code> | the scale tonic (or false to get intervals) |

**Example**  
```js
var scale = require('tonal.scale')
// get scale notes using type and tonic
scale.create('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
// get scale intervals (tonic false)
scale.create('maj7', false) // => ['1P', '3M', '5P', '7M']
// partially applied
const maj7 = scale.create('maj7')
maj7('C') // => ['C', 'E', 'G', 'B']
// create scale from intervals
scale.create('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
```
<a name="names"></a>

## names(aliases) ⇒ <code>Array</code>
Return the available scale names

**Kind**: global function  
**Returns**: <code>Array</code> - the scale names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
scaleNames() // => ['maj7', ...]
```
<a name="get"></a>

## get(name) ⇒ <code>Array</code>
Get scale notes from scale name

**Kind**: global function  
**Returns**: <code>Array</code> - the scale notes  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name |

**Example**  
```js
var scale = require('tonal-scale')
scale.get('C7') // => ['C', 'E', 'G', 'Bb']
scale.get('CMaj7') // => ['C', 'E', 'G', 'B']
```
