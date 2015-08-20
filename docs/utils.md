# utils 




## coerce()  *private method*

Internal function: ensures the param is a string

It allows parse to be called on itself:
`parse(parse(parse('C3')))`




### Returns


- `Void`




## memoize(the)  *private method*

Simplest and fast memoize function

This is base in two restrictive asumptions:
- the function only receives __one paramater__
- the parameter __is a string__

The idea is to be fast and small.

For a more complete memoize solution see:
https://github.com/addyosmani/memoize.js


### Parameters

- **the** `Function`   function to memoize




### Returns


-   




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
