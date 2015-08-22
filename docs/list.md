# list 




## areIntervals() 

Given a list, check it its a interval list






### Returns


- `Void`




## areIntervals() 

Given a list, check it its a note list






### Returns


- `Void`




## listDict(data, parser) 

Create a list dictionary from a hash map data and a name parser

A list dictionary is a function that generates lists from keys. It uses
a parser to remove the tonic (if present) from the key. Then look up
into the hash for a name and pass it to a list generator.

If the returned dictionary is called without arguments, a list of all keys
is returned

If the name is not found in the hash data, it throws an exception

The parser should receive one string and return an object with two string
properties:
- tonic: a note if any, or null
- type: (required) the key to lookfor

The scale/scale and chord/chord functions uses this to create a generator.


### Parameters

- **data** `Hash`   - the data hash (dictionary)
- **parser** `Function`   - a function that parses the name and returns an object with tonic (if not present) and the name properties




### Examples

```javascript
var listDict = require('tonal/data/listDict')
var scale = listDict({'major': 2773})
scale('C major') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
scale('major') // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
// get keys:
scale() // => ['major']
```


### Returns


- `Function`   the list dictionary




## distance() 








### Returns


- `Void`




## isBinaryList(number) 

Determine if a given number is a valid binary list number

A valid binary list is a binary number with two conditions:
- its 12 digit long
- starts with 1 (P1 interval)

The binary number can be expressed in decimal as well (i.e 2773)


### Parameters

- **number** `String`   - the number to test




### Examples

```javascript
isBinary('101010101010') // => true
isBinary(2773) // => true
isBinary('001010101010') // => false (missing first 1)
isBinary('1001') // => false
```


### Returns


- `boolean`   true if its a valid scale binary number




## list(list) 

Get a list of notes or isInterval

This is the principal function to create lists. Basically does the same as
`list/parse` but if an array is given, it returns it without modification
or validation (so, only pass an array when you are sure that is a valid list)


### Parameters

- **list** `String` `Array`   - the list to be parsed or passed




### Examples

```javascript
list('c d# e5') // => ['C4', 'D#4', 'E5']
list('P1 m2') // => ['P1', 'm2']
list('bb2') // => ['Bb2']
list('101') // => ['P1', 'M2']
// to validate an array
list(['C#3', 'P2'].join(' ')) // => null
```


### Returns


- `Array`   an array list of notes or intervals (or anything it you pass an array to the function)




## transpose() 








### Returns


- `Void`




## parse(list) 

Parse a string to a note or interval list

The string can be notes or intervals separated by white spaces or a binary
or decimal representation of a interval list


### Parameters

- **list** `String` `Integer`   - the string to be parsed




### Returns


- `Array`   an array of notes or intervals, null if not valid list




## module.exports() 

Get the retrograde of a set

Alias of set/reverse




### Returns


- `Void`




## reverse(list) 

Get the reverse (retrograde) of a list




### Parameters

- **list** `String` `Array` `Integer`   - the list to be reversed




### Examples

```javascript
reverse('A B C') // => ['C', 'B', 'A']
```


### Returns


- `Array`   The reversed list




## rotate() 

Rotate a list






### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
