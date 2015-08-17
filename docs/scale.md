# scale 




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
