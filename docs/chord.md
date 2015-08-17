# chord 




## module.exports(name) 

A chord set generator

Given a chord name returns the intervals or notes


### Parameters

- **name** `String`   - a chord name (with or without tonic)




### Examples

```javascript
chord('C') // => ['C4', 'E4', 'G4']
chord('C major') // => []
```


### Returns


- `Array`   a set (of notes or intervals depending on the name)




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
