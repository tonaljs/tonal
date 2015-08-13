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




## genericType(number) 

Return the type ('perfect' or 'major') of the generic interval

A generic interval its the number of a diatonic interval


### Parameters

- **number** `Integer`   - the generic interval (positive or negative, can't be zero)




### Examples

```javascript
genericType(1) // 'perfect'
genericType(4) // 'perfect'
genericType(5) // 'perfect'
genericType(8) // 'perfect'
genericType(9) // 'major'
```


### Returns


- `String`   the type ('perfect' or 'major')




## INTERVAL() 








### Returns


- `Void`




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




## number() 








### Returns


- `Void`




## midi() 








### Returns


- `Void`




## transposeGeneric() 








### Returns


- `Void`




## transposeGeneric(number, note) 

Transpose note a generic interval

A generic interval is defined is the number part of a diationc interval
(2: ascendent second, 3: ascendent thirth, -4: descending fourth, ...)
The generic interval do not take account of diatonic spelling


### Parameters

- **number** `Integer`   - the generic interal: number of steps to tranpose (is a one-based index, zero is not allowed, and can be negative to move backwards)
- **note** `String`   - the note (everything but the step is ignored)




### Examples

```javascript
transpose('C', 0) // => 'C'
transpose('C', 1) // => 'D'
transpose('C#', 1) // => 'D'
transpose('C2', -1) // => 'B'
transpose('C##3', -1) // => 'B'
```


### Returns


- `String`   the tranposed step (in uppercase)




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
