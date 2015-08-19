# interval 




## classNumber(interval) 

Get the [interval class](https://en.wikipedia.org/wiki/Interval_class) of
a given interval.

In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes


### Parameters

- **interval** `String` `Interval`   - the Interval




### Examples

```javascript
var classNumber = require('tonal/classNumber')
classNumber('P8') // => 0
classNumber('m6') // => 4
```


### Returns


- `Integer`   A value between 0 and 6




## distanceChromatic(root, destination) 

Get the distance in semitones between two notes




### Parameters

- **root** `String`   - the root note
- **destination** `String`   - the destination note




### Examples

```javascript
distanceChromatic('C', 'G') // => 7
distanceChromatic('G', 'C') // => -7
```


### Returns


- `Void`




## distanceGeneric() 

Get the generic interval distance between two notes






### Examples

```javascript
distanceGeneric('C', 'G') // => 4
distanceGeneric('G', 'C') // => -4
```


### Returns


- `Void`




## distanceInterval(root, destination) 

Get the interval between two notes




### Parameters

- **root** `String`   - root or tonic note
- **destination** `String`   - the destination note




### Returns


- `String`   an interval




## genericToDiationic() 

Given a generic interval and a number of semitones, return the interval
(if exists)






### Returns


- `Void`




## genericType(number) 

Return the type ('perfect' or 'major') of the [generic interval](https://en.wikipedia.org/wiki/Generic_interval)

A generic interval its the number of a diatonic interval


### Parameters

- **number** `Integer`   - the generic interval (positive integer)




### Examples

```javascript
genericType(0) // 'perfect'  <- unison
genericType(3) // 'perfect'  <- fourth
genericType(4) // 'perfect'  <- fifth
genericType(7) // 'perfect'  <- octave
genericType(8) // 'major'    <- nineth
```


### Returns


- `String`   the type ('perfect' or 'major')




## generic(interval) 

Convert a [diatonic interval](https://en.wikipedia.org/wiki/Interval_(music))
into a [generic interval](https://en.wikipedia.org/wiki/Generic_interval)




### Parameters

- **interval** `String`   - the diatonic interval




### Examples

```javascript
generic('M9') // => 1
```


### Returns


- `Integer`   the generic interval




## invert() 

Invert an interval






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




## numberToGeneric(number) 

Give a interval number, returns a [generic interval](https://en.wikipedia.org/wiki/Generic_interval)




### Parameters

- **number** `Integer`   - the interval number




### Returns


- `Integer`   the generic interval (an integer bewteen 0 and 6)




## parse(name) 

Parse an interval and get its properties

This method retuns an object with the following properties:
- quality: the quality (one of `dmPMA` for dimished, minor, perfect, major and
augmented respectively)
- dir: direction, 1 for ascending intervals, -1 for descending ones
- num: diatonic number (a positive integer bigger that 0)
- generic: generic interval (https://en.wikipedia.org/wiki/Generic_interval), an
integer between (0 and 6)
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




## semitones(interval) 

Get the semitones distance of an intervals




### Parameters

- **interval** `String`   - the interval




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




## simplifyNumber(number) 

Given a valid interval number, return its simplified version




### Parameters

- **number** `Integer`   - the number to be simplified (must be a positive integer)




### Returns


- `Integer`   the simplified number (a number between 1 and 8)




## midi() 








### Returns


- `Void`




## transposeGeneric(generic, note) 

Transpose note a generic interval

A generic interval is defined is the number part of a diationc interval
(2: ascendent second, 3: ascendent thirth, -4: descending fourth, ...)
The generic interval do not take account of diatonic spelling


### Parameters

- **generic** `Integer`   - the generic interval
- **note** `String`   - the note (everything but the step is ignored)




### Examples

```javascript
transpose(0, 'C') // => 'C'
transpose(1, 'C') // => 'D'
transpose(-1, 'C') // => 'B'
```


### Returns


- `String`   the tranposed step (in uppercase)




## transposeGeneric() 








### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
