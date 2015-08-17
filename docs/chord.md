# chord 




## module.exports(name) 

A chord set generator

Given a chord name returns the intervals or notes


### Parameters

- **name** `String`   - a chord name (with or without tonic)




### Examples

```javascript
chord('M') // => ['P1', 'M3', 'P5']
chord('C7') // => ['C4', 'E4', 'G4', 'B4']
```


### Returns


- `Array`   a set (of notes or intervals depending on the name)




## parse() 

Parse a chord name and returns the tonic (if any) and the chord type






### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
