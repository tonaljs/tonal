# interval 




## classNumber(interval) 

Get the [interval class](https://en.wikipedia.org/wiki/Interval_class) of
a given interval.

In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes


### Parameters

- **interval** `String` `Interval`   - the Interval




### Examples

```javascript
var classNumber = require('tonal/classNumber')
classNumber('P8') // => 0
classNumber('m6') // => 4
```


### Returns


- `Integer`   A value between 0 and 6




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
