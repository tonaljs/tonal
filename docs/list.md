# list 




## chromaticList(length) 

Returns a interval list with a chromatic scale

The harmonic chromatic scale is the same whether rising or falling and
includes all the notes in the major, harmonic minor or melodic minor
scales plus flattened second and sharpened fourth degrees


### Parameters

- **length** `Integer`   - the number of items in the list




### Returns


- `Array`   a list (of intervals or notes, depending of params)




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




## isNoteList(list) 

Test if the given list is a valid note list

A valid note list is an array of note strings


### Parameters

- **list** `Object`   - the list to be tested




### Returns


- `Boolean`   true if is a note list




## toList(note, identifier) 

Create a list (either a group of intervals or notes depending if you provide
a tonic parameter or not)

It uses `list/intervals` or `list/notes` depending
on the action. Is a convenience function when creating scales or chords


### Parameters

- **note** `String`   - the tonic note (can be null)
- **identifier** `String` `Integer` `Array`   - the list identifier




### Returns


- `Array`   an array of notes or intervals




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


-   




## binary(set) 

Return a binary representation of the set

The binary representation of a set is a binary number in which the first
digit is always 1 (the 'P1' interval). It's important to note that
`set === toIntervals(binary(set))` is not always true (you loose some
information when converting to a binary set)


### Parameters

- **set** `Array` `Integer` `Binary`   - the set to get the binary from




### Returns


- `String`   the binary string representation of that set




## toIntervals(list) 

Given a list return its intervals




### Parameters

- **list** `String` `Decimal` `Array`   - the list to get the intervals from




### Returns


- `Array`   an array of intervals




## noteList(source, note) 

Return a note list from a source

You need a source and a root. As a source you can use a binary number (or
decimal equivalent), an interval list or a note list (both as arrays or strings)

If a note list is provided, the notes are transposed to ensure the first note
is the given one


### Parameters

- **source** `Array` `String` `Integer`   - an interval or note list in any of its representations
- **note** `String`   - the tonic or root




### Returns


- `Array`   a list of notes




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
