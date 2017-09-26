<a name="module_interval"></a>

# interval
[![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)
[![tonal](https://img.shields.io/badge/tonal-interval-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-interval` is a collection of functions to create and manipulate music intervals.

The intervals are strings in shorthand notation. Two variations are supported:

- standard shorthand notation: type and number, for example: 'M3', 'd-4'
- inverse shorthand notation: number and then type, for example: '3M', '-4d'

The problem with the standard shorthand notation is that some strings can be
parsed as notes or intervals, for example: 'A4' can be note A in 4th octave
or an augmented four. To remove ambiguity, the prefered notation in tonal is the
inverse shortand notation.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
import * as interval from 'tonal-interval'
// or const interval = require('tonal-interval')
interval.semitones('4P') // => 5
interval.invert('3m') // => '6M'
interval.simplify('9m') // => '2m'
```

## Install

[![npm install tonal-interval](https://nodei.co/npm/tonal-interval.png?mini=true)](https://npmjs.org/package/tonal-interval/)

## API Documentation

<a name="module_interval.fromSemitones"></a>

## `interval.fromSemitones` ⇒ <code>String</code>
Get interval name from semitones number. Since there are several interval
names for the same number, the name it's arbitraty, but deterministic.

**Kind**: static constant of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the interval name  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Integer</code> | the number of semitones (can be negative) |

**Example**  
```js
import { fromSemitones } from 'tonal-interval'
fromSemitones(7) // => '5P'
// or using tonal
tonal.fromSemitones(-7) // => '-5P'
```
