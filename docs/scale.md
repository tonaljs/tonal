# scale 




## parse(scale) 

Parase a scale name and returns its components

A scale name can have two components:
- tonic: a note specifing the tonic
- type: the scale type


### Parameters

- **scale** `String`   - the scale name (with optional tonic)




### Examples

```javascript
parse('C major') // => { tonic: 'C', type: 'major' }
```


### Returns


- `Object`   the parsed scale name




## scaleSpace() 

Get the 2048 scales






### Examples

```javascript
scaleSpace() // => an array of 2048 binary numbers
```


### Returns


- `Void`




## module.exports(name) 

A scale set generator

Given a scale name returns the intervals or notes


### Parameters

- **name** `String`   - a scale name (with or without tonic)




### Examples

```javascript
scale('major') // => []
scale('C major') // => []
```


### Returns


- `Array`   a set (of notes or intervals depending on the name)




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
