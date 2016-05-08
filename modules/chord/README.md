# tonal-chord [![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)

[![tonal](https://img.shields.io/badge/tonal-chord-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-chord` is a collection of functions to create and manipulate music chords.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-chord`

## API Reference

<dl>
<dt><a href="#chord">chord(source, tonic)</a> ⇒ <code>Array</code></dt>
<dd><p>Create chords by chord type or intervals and tonic. The returned chord is an
array of notes (or intervals if you specify <code>false</code> as tonic)</p>
<p>This function is currified</p>
</dd>
<dt><a href="#chordNames">chordNames(aliases)</a> ⇒ <code>Array</code></dt>
<dd><p>Return the available chord names</p>
</dd>
<dt><a href="#fromChordName">fromChordName(name)</a> ⇒ <code>Array</code></dt>
<dd><p>Get chord notes from chord name</p>
</dd>
</dl>

<a name="chord"></a>

## chord(source, tonic) ⇒ <code>Array</code>
Create chords by chord type or intervals and tonic. The returned chord is an
array of notes (or intervals if you specify `false` as tonic)

This function is currified

**Kind**: global function  
**Returns**: <code>Array</code> - the chord notes  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> | the chord type, intervals or notes |
| tonic | <code>String</code> | the chord tonic (or false to get intervals) |

**Example**  
```js
import chord from 'tonal-chord'
// get chord notes using type and tonic
chord('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
// get chord intervals (tonic false)
chord('maj7', false) // => ['1P', '3M', '5P', '7M']
// partially applied
const maj7 = chord('maj7')
maj7('C') // => ['C', 'E', 'G', 'B']
// create chord from intervals
chord('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
```
<a name="chordNames"></a>

## chordNames(aliases) ⇒ <code>Array</code>
Return the available chord names

**Kind**: global function  
**Returns**: <code>Array</code> - the chord names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
import { chordNames } from 'tonal-chords'
chordNames() // => ['maj7', ...]
```
<a name="fromChordName"></a>

## fromChordName(name) ⇒ <code>Array</code>
Get chord notes from chord name

**Kind**: global function  
**Returns**: <code>Array</code> - the chord notes  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the chord name |

**Example**  
```js
import { fromName } from 'tonal-chords'
fromName('C7') // => ['C', 'E', 'G', 'Bb']
fromName('CMaj7') // => ['C', 'E', 'G', 'B']
```
