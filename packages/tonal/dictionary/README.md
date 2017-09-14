<a name="module_dictionary"></a>

# dictionary
This module tonal dictionaries: functions that, given a name, returns an
array of intervals.


* [dictionary](#module_dictionary)
    * [`.pitchset`](#module_dictionary.pitchset)
    * [`.build(source, parse)`](#module_dictionary.build)
    * [`.dictionary(data)`](#module_dictionary.dictionary) ⇒ <code>Object</code>
    * [`.detector(dictionary, builder)`](#module_dictionary.detector) ⇒ <code>function</code>

<a name="module_dictionary.pitchset"></a>

## `dictionary.pitchset`
A dictionary with all known pitchsets (includes chords and scales)

**Kind**: static constant of [<code>dictionary</code>](#module_dictionary)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="module_dictionary.build"></a>

## `dictionary.build(source, parse)`
Create a tonal dictionary from data object

The data object must have this form:
`{ key: [intervals, [aliases]] }`

**Kind**: static method of [<code>dictionary</code>](#module_dictionary)  

| Param | Type |
| --- | --- |
| source | <code>Object</code> | 
| parse | <code>function</code> | 

**Example**  
```js
const dictionary = require('tonal-dictionary')
var DATA = {
  'maj7': ['1 3 5 7', ['Maj7']],
  'm7':   ['1 b3 5 7']
}
var chords = dictionary.build(DATA);
chords('maj7') // => [ '1', '3', '5', '7' ]
chords('Maj7') // => [ '1', '3', '5', '7' ]
chords('m7') // => ['1', 'b3', '5', '7']
chords('m7b5') // => null
chords.keys() // => ['maj7', 'm7']
chords.keys(true) // => ['maj7', 'm7', 'Maj7']
```
<a name="module_dictionary.dictionary"></a>

## `dictionary.dictionary(data)` ⇒ <code>Object</code>
Create a tonal dictionary. A dictionary is an object with two functions: get and
keys.

The data given to this constructor it's a HashMap in the form:
`{ key: [intervals, [aliases]] }`

**Kind**: static method of [<code>dictionary</code>](#module_dictionary)  
**Returns**: <code>Object</code> - the dictionary object  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>HashMap</code> | the dictionary data |

**Example**  
```js
var dictionary = require('tonal-dictionary').dictionary
var DATA = {
'maj7': ['1 3 5 7', ['Maj7']],
  'm7': ['1 b3 5 7']
}
var chords = dictionary(DATA, function (str) { return str.split(' ') })
chords.get('maj7') // => [ '1', '3', '5', '7' ]
chords.get('Maj7') // => [ '1', '3', '5', '7' ]
chords.get('m7') // => ['1', 'b3', '5', '7']
chords.get('m7b5') // => null
chords.keys() // => ['maj7', 'm7']
chords.keys(true) // => ['maj7', 'm7', 'Maj7']
```
<a name="module_dictionary.detector"></a>

## `dictionary.detector(dictionary, builder)` ⇒ <code>function</code>
Create a pitch set detector. Given a dictionary data, it returns a
function that tries to detect a given pitch set inside the dictionary

**Kind**: static method of [<code>dictionary</code>](#module_dictionary)  
**Returns**: <code>function</code> - the detector function  
**See**

- chord.detect
- scale.detect


| Param | Type | Description |
| --- | --- | --- |
| dictionary | <code>Dictionary</code> | the dictionary object |
| builder | <code>function</code> \| <code>String</code> | (Optional) a function that given a name and a tonic, returns the object or a string to join both |

**Example**  
```js
var detect = detector(dictionary(DATA), '')
detect('c d e b') // => 'Cmaj/'
```
