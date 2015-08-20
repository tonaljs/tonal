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




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
