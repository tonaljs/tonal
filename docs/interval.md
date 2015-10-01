# Interval module

Create and manipulate intervals. An interval in tonal is a string in the form: `(direction)?(number)(quality)` where direction is `'-'` or empty string, number is a positive decimal number and quality is one of `dd`, `d`, `m`, `M`, `A` or `AA`. `'1P'` and `-9m` are valid intervals.

You can get the interval properties with `interval/props` and manipulate in the standard ways: add two intervals, simplify intervals, get opposite...

## Interval function list

- [add](#intervaladd) -  Add two intervals
- [build](#intervalbuild) -  Build an interval (string) given a number, and optionally a quality and octave.
- [harmonizer](#intervalharmonizer) -  Get an harmonizer for a list of intervals. An harmonizer is a function that _harmonizes_ a pitch: given a pitch returns a collection of pitches.
- [invert](#intervalinvert) -  Get the [inversion](https://en.wikipedia.org/wiki/Interval_(music)#Inversion) of an interval.
- [isInterval](#intervalisinterval) -  Test if a string is a valid interval
- [opposite](#intervalopposite) -  Get the opposite of an interval
- [props](#intervalprops) -  Get interval properties
- [semitones](#intervalsemitones) -  Get the semitones of a interval
- [simplify](#intervalsimplify) -  Simplify an interval



## API

----
###### [interval/add](#interval-module)



#### add(interval1, interval2) → {String}



Add two intervals

__Arguments:__

Name|Type|Description
---|---|---
`interval1`|String|the first interval
`interval2`|String|the second interval


__Returns:__

Type|Description
---|---
String|the resulting interval


__Example:__

```js
add('M2', 'M2') // => 'M3'
```

Source: [interval/add.js](https://github.com/danigb/tonal/tree/master/lib/interval/add.js)
Test: [interval/addTest.js](https://github.com/danigb/tonal/tree/master/test/interval/addTest.js)

----
###### [interval/build](#interval-module)



#### build(number, quality|alteration, oct) → {}



Build an interval (string) given a number, and optionally a quality
and octave.

It can be used to check if a interval is a valid interval:
`build('5M') // => null`

The first parameter can be another interval, but in this case the quality
and octave parameters will have precedence over the interval.

__Arguments:__

Name|Type|Description
---|---|---
`number`|String,Integer|the interval number (can be negative to express descengin intervals) or another interval
`quality|alteration`|String,Integer|(Optional) the interval quality or numberic alteration (0 is perfect or major). Can be null to avoid override the string
`oct`|Integer|(Optional) the octaves. If negative, the direction of the interval is descendent. 0 by default.


__Returns:__

Type|Description
---|---


__Example:__

```js
build(2) // => '2M'
build(2, 'm') // => '2m'
build(2, 'a', 1) // => '9A'
build(2, 'a', -1) // => '-9A'
build(2, null, 1) // => '9M'
build(-2, 'm', 1) // => '-9m'
build(-2, -1, 1) // => '-9m'
build(2, 'AA') // => '2AA'
build(2, 'AAA') // => null
build('2P') // => null
```

Source: [interval/build.js](https://github.com/danigb/tonal/tree/master/lib/interval/build.js)
Test: [interval/buildTest.js](https://github.com/danigb/tonal/tree/master/test/interval/buildTest.js)

----
###### [interval/harmonizer](#interval-module)



#### harmonizer() → {}



Get an harmonizer for a list of intervals. An harmonizer is a function that
_harmonizes_ a pitch: given a pitch returns a collection of pitches.

The returned function receives two parameters:
- {String} pitch - the pitch to be harmonized
- {boolean} pitchClassesOnly - set true to get only pitch classes

Harmonizer are the basic construction blocks of scales and chords.

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
var major = harmonizer(['1P', '3M', '5M'])
major('C') // => ['C4', 'E4', 'G4']
major('C', true) // => ['C', 'E', 'G'] (pitch classes only)
major() // => ['1P', '3M', '5M']
```

Source: [interval/harmonizer.js](https://github.com/danigb/tonal/tree/master/lib/interval/harmonizer.js)
Test: [interval/harmonizerTest.js](https://github.com/danigb/tonal/tree/master/test/interval/harmonizerTest.js)

----
###### [interval/invert](#interval-module)



#### invert(interval, ascending) → {}



Get the [inversion](https://en.wikipedia.org/wiki/Interval_(music)#Inversion)
of an interval.

Notice that all inverted intervals are simple.

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String|the interval to invert
`ascending`|Boolean|(Optional) if true, the inverted interval will be ascending, if false (by default) the direction will be the same as the
given interval


__Returns:__

Type|Description
---|---


__Example:__

```js
invert('M9') // => 'M2'
invert('M-10') // => 'M-3'
invert('P-11', true) // => 'P4'
```

Source: [interval/invert.js](https://github.com/danigb/tonal/tree/master/lib/interval/invert.js)
Test: [interval/invertTest.js](https://github.com/danigb/tonal/tree/master/test/interval/invertTest.js)

----
###### [interval/isInterval](#interval-module)



#### isInterval(interval) → {Boolean}



Test if a string is a valid interval

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String|the interval to be tested


__Returns:__

Type|Description
---|---
Boolean|true if its a valid interval


__Example:__

```js
isInterval('blah') // false
isInterval('P5') // true
isInterval('P6') // false
```

Source: [interval/isInterval.js](https://github.com/danigb/tonal/tree/master/lib/interval/isInterval.js)
Test: [interval/isIntervalTest.js](https://github.com/danigb/tonal/tree/master/test/interval/isIntervalTest.js)

----
###### [interval/opposite](#interval-module)



#### opposite() → {}



Get the opposite of an interval

An opposite interval is the same interval with the opposite direction

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
opposite('M2') // => 'M-2'
opposite('P-8') // => 'P8'
```

Source: [interval/opposite.js](https://github.com/danigb/tonal/tree/master/lib/interval/opposite.js)
Test: [interval/oppositeTest.js](https://github.com/danigb/tonal/tree/master/test/interval/oppositeTest.js)

----
###### [interval/props](#interval-module)



#### props(name) → {Array}



Get interval properties

This method retuns an object with the following properties:
- name: the interval name
- quality: the quality (one of `dmPMA` for dimished, minor, perfect, major and
augmented respectively)
- num: diatonic number (a positive integer bigger that 0)
- alter: an integer with the alteration respect to 'P' or 'M' (depending on the type)
- dir: direction, 1 for ascending intervals, -1 for descending ones
- oct: the number of octaves (a positive integer)
- type: the interval type. 'P' for 'perfect', 'M' for major. This is not the
quality of the interval, just if it is perfectable or not.
- semitones: the size of the interval in semitones

__Arguments:__

Name|Type|Description
---|---|---
`name`|String|the name of the interval to be propsd


__Returns:__

Type|Description
---|---
Array|a interval object or null if not a valid interval


__Example:__

```js
var props = require('tonal/interval/props')
props('-5P') // => { name: '-5P', quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
props('9m') // => { name: '9m', quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }
```

Source: [interval/props.js](https://github.com/danigb/tonal/tree/master/lib/interval/props.js)
Test: [interval/propsTest.js](https://github.com/danigb/tonal/tree/master/test/interval/propsTest.js)

----
###### [interval/semitones](#interval-module)



#### semitones(interval) → {Interger}



Get the semitones of a interval

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String|the interval to get the semitones number from


__Returns:__

Type|Description
---|---
Interger|the semitones or null if not a valid interval


__Example:__

```js
semitones('5P') // => 7
```

Source: [interval/semitones.js](https://github.com/danigb/tonal/tree/master/lib/interval/semitones.js)
Test: [interval/semitonesTest.js](https://github.com/danigb/tonal/tree/master/test/interval/semitonesTest.js)

----
###### [interval/simplify](#interval-module)



#### simplify(interval, ascending) → {}



Simplify an interval

__Arguments:__

Name|Type|Description
---|---|---
`interval`|String|the interval to be simplified
`ascending`|boolean|(optional) if true, the simplified interval will be always ascending


__Returns:__

Type|Description
---|---


__Example:__

```js
simplify('9M') // => '2M'
simplify('-9M') // => '-2M'
simplify('-2M', true) // => '2M'
```

Source: [interval/simplify.js](https://github.com/danigb/tonal/tree/master/lib/interval/simplify.js)
Test: [interval/simplifyTest.js](https://github.com/danigb/tonal/tree/master/test/interval/simplifyTest.js)

