# tonal-midi [![npm version](https://img.shields.io/npm/v/tonal-midi.svg)](https://www.npmjs.com/package/tonal-midi)

[![tonal](https://img.shields.io/badge/tonal-midi-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-midi` is a collection of functions to convert between midi numbers and note names.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-midi`

## API Reference

<dl>
<dt><a href="#isMidiNum">isMidiNum(num)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if the given number is a valid midi note number</p>
</dd>
<dt><a href="#toMidi">toMidi(pitch)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get midi number for a pitch</p>
</dd>
<dt><a href="#fromMidi">fromMidi(midi)</a> ⇒ <code>String</code></dt>
<dd><p>Given a midi number, returns a note name. The altered notes will have
flats.</p>
</dd>
<dt><a href="#fromMidiS">fromMidiS(midi)</a> ⇒ <code>String</code></dt>
<dd><p>Given a midi number, returns a note name. The altered notes will have
sharps.</p>
</dd>
</dl>

<a name="isMidiNum"></a>

## isMidiNum(num) ⇒ <code>Boolean</code>
Test if the given number is a valid midi note number

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if it's a valid midi note number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Object</code> | the thing to be tested |

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
<a name="fromMidiS"></a>

## fromMidiS(midi) ⇒ <code>String</code>
Given a midi number, returns a note name. The altered notes will have
sharps.

**Kind**: global function  
**Returns**: <code>String</code> - the note name  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>Integer</code> | the midi note number |

**Example**  
```js
tonal.fromMidiS(61) // => 'C#4'
```
