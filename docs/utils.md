# utils 




## coerce()  *private method*

Internal function: ensures the param is a string

It allows parse to be called on itself:
`parse(parse(parse('C3')))`




### Returns


- `Void`




## memoize(func)  *private method*

Simplest and fastest memoize function I can imagine

This is in base of two restrictive asumptions:
- the function only receives __one paramater__
- the parameter __is a string__

For a more complete memoize solution see:
https://github.com/addyosmani/memoize.js


### Parameters

- **func** `Function`   - the function to memoize




### Returns


- `Function`   A memoized function




## strict() 

Decorate a function to throw exception when return null






### Examples

```javascript
var parse = require('tonal/note/parse')
var strictParse = strict('Not a valid note', parse)
strictParse('P8') // throws Error with msg 'Not a valid note'
```


### Returns


- `Void`




## unstrict() 

Decorate a function to return null when a exception is thrown

The opposite of `util/strict`




### Examples

```javascript
var alwaysNull = unstrict(function () { throw Error() })
alwaysNull() // => null
```


### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
