# interval 




## add(interval1, interval2) 

Add two intervals




### Parameters

- **interval1** `String`   - the first interval
- **interval2** `String`   - the second interval




### Examples

```javascript
add('M2', 'M2') // => 'M3'
```


### Returns


- `String`   the resulting interval




## fromNotes(from, to) 

Get the interval between two notes

This is the function to calculate distances (expressed in intervals) for
two notes. An alias of this function is in `note/distance`

This is an 'strict' function: if the notes are note valid, an
exception is thrown.

You can get a _curryfied_ version of this function by passing only one
parameter. See examples below:


### Parameters

- **from** `String`   - first note
- **to** `String`   - second note




### Examples

```javascript
fromNotes('C', 'D') // => 'M2'
['C', 'D', 'Eb'].map(fromNotes('C')) // => ['P1', 'M2', 'm3']
```


### Returns


- `String`   the interval between notes




## generic(number)  *private method*

+ Given an interval number, return its generic interval

Probably you don't need this function. Use ´interval/parse´ to obtain the
generic number of an interval

The generic interval is an object with two properties:
- num: {Integer} the generic number
- perfectable: {Boolean} if the generic interval is perfectable or note


### Parameters

- **number** `Integer`   - the interval number




### Returns


- `Object`   the generic interval object




## interval(num, alter, oct, descending) 

Create a interval from its components




### Parameters

- **num** `Integer`   - the interval number
- **alter** `Integer`   - the interval alteration (0 is perfect or major)
- **oct** `Integer`   - (Optional) the octaves, 0 by default
- **descending** `boolean`   - (Optional) create a descending interval (false by default)




### Examples

```javascript
interval(1) // => 'P1'
interval(1, 1) // => 'A1'
interval(1, 1, 2) // => 'A8'
interval(1, 1, 2, -1) // => 'A-8'
interval(2, -1, 2, -1) // => 'm-9'
```


### Returns


- `Void`




## invert(interval, ascending) 

Invert an interval

Get the [inversion](https://en.wikipedia.org/wiki/Interval_(music)#Inversion)
of an interval.


### Parameters

- **interval** `String`   - the interval to invert
- **ascending** `Boolean`   - (Optional) if true, the inverted interval will be ascending, if false (by default) the direction will be the same as the
given interval




### Examples

```javascript
simple('M9') // => 'M2'
simple('M-10') // => 'M-3'
simple('P-11', true) // => 'P4'
```


### Returns


- `Void`




## isInterval(interval) 

Test if a string is a valid interval




### Parameters

- **interval** `String`   - the interval to be tested




### Examples

```javascript
isInterval('blah') // false
isInterval('P5') // true
isInterval('P6') // false
```


### Returns


- `Boolean`   true if its a valid interval




## opposite() 

Given an interval, return its opposite






### Examples

```javascript
opposite('M2') // => 'M-2'
opposite('P-8') // => 'P8'
```


### Returns


- `Void`




## parse(name) 

Parse an interval and get its properties

This method retuns an object with the following properties:
- name: the parsed interval
- quality: the quality (one of `dmPMA` for dimished, minor, perfect, major and
augmented respectively)
- dir: direction, 1 for ascending intervals, -1 for descending ones
- num: diatonic number (a positive integer bigger that 0)
- generic: generic interval (https://en.wikipedia.org/wiki/Generic_interval), an
integer between (0 and 6)
- oct: the number of octaves (a positive integer)
- perfectable: true if the interval is perfectable
- alter: an integer with the alteration respect to the cannonical.
For perfectable intervals is 'P': 0, 'd': -1, 'A': +1 and for
non perfectable intervals is 'M': 0, 'm', -1, 'd': -2, 'A': +1


### Parameters

- **name** `String`   - the name of the interval to be parsed




### Examples

```javascript
var parse = require('tonal/interval/parse')
parse('P-5') // => {quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
parse('m9') // => {quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }
```


### Returns


- `Array`   a interval object or null if not a valid interval




## semitones(interval, simplified) 

Get the size in semitones of an interval

This is an _strict_ function: if the interval is note valid, an exception
is thrown.


### Parameters

- **interval** `String`   - the interval
- **simplified** `Boolean`   - if true, returns the semitones distance of the simplified interval




### Examples

```javascript
semitones('P5') // => 7
```


### Returns


- `Integer`   the number of semitones




## simple(interval, ascending) 

Simplify an interval




### Parameters

- **interval** `String`   - the interval to be simplified
- **ascending** `boolean`   - (optional) if true, the simplified interval will be always ascending




### Examples

```javascript
simple('M9') // => 'M2'
simple('M-9') // => 'M-2'
simple('M-9', true) // => 'M2'
```


### Returns


- `Void`




## transpose(interval, note) 

Transpose a note by an interval

This is the principal function of interval module. You should be able to
transpose any note with any interval. (if not, is a bug ;-)

You can also get a currified version by passing one parameter instead
of two. For example, with `transpose('M2')` you get a function that transposes
any note by a 'M2' interval. The same way, with `transpose('C4')` you get
a function that transposes C4 to the given interval. See examples below.

This is an _strict_ function: if note or interval are not valid, an exception
is thrown


### Parameters

- **interval** `String`   - the interval to tranpose
- **note** `String`   - the note to be transposed




### Examples

```javascript
transpose('M2', 'E') // => 'F#4'
transpose('M-2', 'C') // => 'Bb3'
['C', 'D', 'E'].map(transpose('M2')) // => ['D4', 'E4', 'F#4']
['M2', 'm3', 'P-8'].map(tranapose('C')) // => ['D4', 'Eb4', 'C3']
```


### Returns


- `String`   the resulting note




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
