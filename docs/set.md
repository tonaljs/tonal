# set 




## binary(set) 

Return a binary representation of the set

The binary representation of a set is a binary number in which the first
digit is always 1 (the 'P1' interval). It's important to note that
`set === intervals(binary(set))` is not always true (you loose some
information when converting to a binary set)


### Parameters

- **set** `Array` `Integer` `Binary`   - the set to get the binary from




### Returns


- `String`   the binary string representation of that set




## chromaticIntervalSet() 

Returns a set of intervals that represents an harmonic chromatic scale

The harmonic chromatic scale is the same whether rising or falling and
includes all the notes in the major, harmonic minor or melodic minor
scales plus flattened second and sharpened fourth degrees




### Returns


- `Void`




## intervalSet(set) 

Given a set identifier return the intervals




### Parameters

- **set** `String` `Decimal` `Array`   - the set to get the intervals from




### Returns


- `Array`   an array of intervals




## isBinarySet(number) 

Determine if a given number is a valid binary set number

A valid binary set is any binary number that starts with 1 (P1 interval)
The binary number can be expressed in decimal


### Parameters

- **number** `String`   - the number to test




### Examples

```javascript
isBinary('100') // => true
isBinarySet(2773) // => true
isBinarySet('010') // => false
```


### Returns


- `boolean`   true if its a valid scale binary number




## isIntervalSet(set) 

Test is the given set is an interval set

An interval set is an array where all items are inteval strings and
the first item is 'P1'


### Parameters

- **set** `Object`   - the set to be tested




### Examples

```javascript
isIntervalSet(['P1']) // => true
```


### Returns


- `Boolean`   true if is an interval set




## isNoteSet(set) 

Test if the given set is a valid note set

A valid note set is an array of note strings


### Parameters

- **set** `Object`   - the set to be tested




### Returns


- `Boolean`   true if is a note set




## noteSet(set) 

Given a set and a note, return a set with the same intervals but starting from note




### Parameters

- **set** `Array` `String` `Integer`   - the original set. Can be a notes or intervals array, a binary string set or a decimal set




### Returns


- `Void`




## module.exports() 

Get the retrograde of a set

Alias of set/reverse




### Returns


- `Void`




## reverse(set) 

Get the reverse (retrograde) of a set




### Parameters

- **set** `String` `Array` `Integer`   - the set to be reversed




### Examples

```javascript
reverse('A B C') // => ['C', 'B', 'A']
```


### Returns


-   




## set(note, identifier) 

Create a set (either a group of intervals or notes depending if you provide
a tonic parameter or not)

It uses `set/intervals` or `set/notes` depending
on the action. Is a convenience function when creating scales or chords


### Parameters

- **note** `String`   - the tonic note (can be null)
- **identifier** `String` `Integer` `Array`   - the set identifier




### Returns


- `Array`   an array of notes or intervals




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
