# interval 




## intervalClass(interval) 

Get the [interval class](https://en.wikipedia.org/wiki/Interval_class) of
a given interval.

In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes


### Parameters

- **interval** `String` `Interval`   - the Interval




### Examples

```javascript
var intervalClass = require('tonal/interval-class')
intervalClass('P8') // => 0
intervalClass('m6') // => 4
```


### Returns


- `Integer`   A value between 0 and 6




## direction(interval) 

Get the interval direction (1 ascending, -1 descending)




### Parameters

- **interval** `String`   - the interval




### Examples

```javascript
direction('P5') // => 1
direction('P-4') // => -1
```


### Returns


- `Integer`   the direction (1: ascending interval, -1: descending interval)




## genericToDiationic() 








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




## INTERVAL() 








### Returns


- `Void`




## numberToGeneric(number) 

Give a interval number, returns a [generic interval](https://en.wikipedia.org/wiki/Generic_interval)




### Parameters

- **number** `Integer`   - the interval number




### Returns


- `Integer`   the generic interval (an integer bewteen 0 and 6)




## number() 

Return the number (diatonic number or generic interval) of an interval






### Returns


- `Void`




## parse(name)  *private method*

Parse a interval




### Parameters

- **name** `String`   - the name of the interval to be parsed




### Examples

```javascript
var parse = require('tonal/interval/parse')
parse('P-5') // => ['P', -1, 5]
parse('M9') // => ['M', 1, 9]
```


### Returns


- `Array`   an array in the form [quality, direction, number]




## parse() 








### Returns


- `Void`




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




## midi() 








### Returns


- `Void`




## transposeGeneric() 








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




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
