# tonal-filter [![npm version](https://img.shields.io/npm/v/tonal-filter.svg)](https://www.npmjs.com/package/tonal-filter)

[![tonal](https://img.shields.io/badge/tonal-filter-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-filter` is a module to help filtering notes.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-filter`

## API Reference

## scaleFilter(scale, note) ⇒ <code>String</code>
This function filter notes using a scale. Given a scale and a note, it
returns the note name if it belongs to the scale or null if not. The
note can be given as string or as midi number.

This function work with heights instead of names, so the note name returned
is not guaranteed to be the same provided (see 'B#3' example)

It can be partially applied.

**Kind**: global function  
**Returns**: <code>String</code> - the note name or null if note in the pitch classes  

| Param | Type | Description |
| --- | --- | --- |
| scale | <code>String</code> &#124; <code>Array</code> | the scale used to filter |
| note | <code>String</code> &#124; <code>Pitch</code> &#124; <code>Number</code> | the note to be filtered |

**Example**  
```js
import { scaleFilter } from 'tonal-filter'
scaleFilter('C D E', 'C4') // => 'C4'
scaleFilter('C D E', 'B#3') // => 'C4'
scaleFilter('C D E', 60) // => 'C4'
aMajor = scaleFilter('A C# E')
[69, 70, 71, 72, 73].map(aMajor) // => [ 'A4', null, null, null, 'C#5' ]
```
