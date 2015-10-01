# Scale module

A scale is a set of consecutive pitch classes.

Tonal provides a big dictionary of scales (108 at this moment) mapped to its names. The main function of this module is `scale/scale` to obtain scale notes or intervals:

```js
var scale = require('tonal/scale/scale')
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('dorian') // => ['1P', '2M', '3m', '4P', '5P', '6M', '7M']
```

## Scale function list

- [find](#scalefind) -  Get the scale name of a pitch set. The pitch set must contain all the pitches of the scale
- [names](#scalenames) -  Get all known scale names (optionally filtered by a function)
- [scale](#scalescale) -  Get the scale (a set of intervals or pitch classes) with a given name and optionally a tonic



## API

----
###### [scale/find](#scale-module)



#### find(pitches) → {String}



Get the scale name of a pitch set. The pitch set must contain all the
pitches of the scale

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|Array,String|the pitches collection


__Returns:__

Type|Description
---|---
String|the scale name or null if not found


__Example:__

```js
 find('C D E F G A B') // => 'C major'
```

Source: [scale/find.js](https://github.com/danigb/tonal/tree/master/lib/scale/find.js)
Test: [scale/findTest.js](https://github.com/danigb/tonal/tree/master/test/scale/findTest.js)

----
###### [scale/names](#scale-module)



#### names(filter, exclude) → {Array}



Get all known scale names (optionally filtered by a function)

The filter function receives an array of intervals and must return true
or false

__Arguments:__

Name|Type|Description
---|---|---
`filter`|Function|the filter function
`exclude`|boolean|alias - (Optioal) if true, returned list won't include aliases names


__Returns:__

Type|Description
---|---
Array|array with all the known names


__Example:__

```js
names() => ['major', 'minor', ....]
```

Source: [scale/names.js](https://github.com/danigb/tonal/tree/master/lib/scale/names.js)
Test: [scale/namesTest.js](https://github.com/danigb/tonal/tree/master/test/scale/namesTest.js)

----
###### [scale/scale](#scale-module)



#### scale(tonic, name) → {Array}



Get the scale (a set of intervals or pitch classes) with a given name and
optionally a tonic

If the scale name does not contains the tonic, a list of intervals is returned

__Arguments:__

Name|Type|Description
---|---|---
`tonic`|String|(Optional) the tonic
`name`|String|the scale name


__Returns:__

Type|Description
---|---
Array|an array of intervals or notes (if tonic is present)


__Example:__

```js
scale('C', 'major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
scale('D', 'diminished whole tone') // => [ 'D', 'Eb', 'F', 'F#', 'Ab', 'Bb', 'C' ]
scale('bebop') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m', '7M']
```

Source: [scale/scale.js](https://github.com/danigb/tonal/tree/master/lib/scale/scale.js)
Test: [scale/scaleTest.js](https://github.com/danigb/tonal/tree/master/test/scale/scaleTest.js)

