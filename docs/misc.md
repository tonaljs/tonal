# misc 




## accidentals(number) 

Given a number of accidentals returns the string representation




### Parameters

- **number** `Integer`   - the number of accidentals (posivite for shaprs, negative for flats, zero for an empty string)




### Examples

```javascript
var accidentals = require('tonal/misc/accidentals')
accidenals(2) // => '##'
accidenals(-2) // => 'bb'
accidenals(0) // => ''
```


### Returns


- `String`   an accidentals string




## alteration() 

TODO: write proper docs






### Examples

```javascript
alteration('C#6') // 1
alteration('Db') // -1
alteration('E') // 0
alteration('#') // => 1
alteration('##') // => 2
alteration('b') // => -1
alteration('bb') // => -2
alteration('') // 0
```


### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
