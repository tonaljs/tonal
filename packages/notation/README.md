# tonal-notation [![npm version](https://img.shields.io/npm/v/tonal-notation.svg)](https://www.npmjs.com/package/tonal-notation)

[![tonal](https://img.shields.io/badge/tonal-notation-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-notation` is a collection of functions to create and manipulate strings with music information.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-notation`

## API Reference

<dl>
<dt><a href="#toStep">toStep(letter)</a> ⇒ <code>Integer</code></dt>
<dd><p>Given a letter, return step</p>
</dd>
<dt><a href="#isStep">isStep(step)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a number is a valid step number (a number from 0 to 6)</p>
</dd>
<dt><a href="#toLetter">toLetter(step)</a> ⇒ <code>String</code></dt>
<dd><p>Given a step, return a letter</p>
</dd>
<dt><a href="#areFlats">areFlats(str)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a string are all flats (<code>b</code>) chars</p>
</dd>
<dt><a href="#areSharps">areSharps(str)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a string are all sharps (<code>#</code>) chars</p>
</dd>
<dt><a href="#toAlt">toAlt(accidentals)</a> ⇒ <code>Integer</code></dt>
<dd><p>Given an accidentals string return its alteration, the number
of semitones (positive for sharps, negative for flats, 0 for none)</p>
</dd>
<dt><a href="#toAcc">toAcc(alteration)</a> ⇒ <code>String</code></dt>
<dd><p>Given an alteration number, returns the accidentals string</p>
</dd>
</dl>

<a name="toStep"></a>

## toStep(letter) ⇒ <code>Integer</code>
Given a letter, return step


**Returns**: <code>Integer</code> - the step number (from 0 to 6)  

| Param | Type | Description |
| --- | --- | --- |
| letter | <code>String</code> | the letter |

<a name="isStep"></a>

## isStep(step) ⇒ <code>Boolean</code>
Test if a number is a valid step number (a number from 0 to 6)


**Returns**: <code>Boolean</code> - true if it's a valid step number, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| step | <code>Integer</code> | the step number |

<a name="toLetter"></a>

## toLetter(step) ⇒ <code>String</code>
Given a step, return a letter


**Returns**: <code>String</code> - the note letter or null if not valid step number  

| Param | Type | Description |
| --- | --- | --- |
| step | <code>Integer</code> | the step number |

<a name="areFlats"></a>

## areFlats(str) ⇒ <code>Boolean</code>
Test if a string are all flats (`b`) chars


**Returns**: <code>Boolean</code> - true if all charaters are `b`, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the string to test |

<a name="areSharps"></a>

## areSharps(str) ⇒ <code>Boolean</code>
Test if a string are all sharps (`#`) chars


**Returns**: <code>Boolean</code> - true if all charaters are `#`, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the string to test |

<a name="toAlt"></a>

## toAlt(accidentals) ⇒ <code>Integer</code>
Given an accidentals string return its alteration, the number
of semitones (positive for sharps, negative for flats, 0 for none)


**Returns**: <code>Integer</code> - the alteration number of null if not a valid accidental strings  

| Param | Type | Description |
| --- | --- | --- |
| accidentals | <code>String</code> | the string to parse |

**Example**  
```js
toAlt('###') // => 3
toAlt('bbb') // => -3
```
<a name="toAcc"></a>

## toAcc(alteration) ⇒ <code>String</code>
Given an alteration number, returns the accidentals string


**Returns**: <code>String</code> - the accidental string  

| Param | Type | Description |
| --- | --- | --- |
| alteration | <code>Integer</code> | the number of semitones (positive and negative values are accepted for sharps and flats) |

**Example**  
```js
toAcc(3) // => '###'
toAcc(-3) // => 'bbb'
```
