# scale 




## fromName() 

Given a scale name, returns its intervals






### Returns


- `Void`




## isBinary() 








### Returns


- `Void`




## isBinary(binary) 

Determine if a given binary string represents a valid scale

A valid binary number is a 12 digit binary number with a 1 in the first position


### Parameters

- **binary** `String`   - the binary number




### Returns


- `boolean`   true if its a valid scale binary number




## isDecimal(decimal) 

Determine if a given decimal number is a valid scale.

A number is a valid decimal number if it's between 2048 and 4096


### Parameters

- **decimal** `String`   - the decimal number




### Returns


- `boolean`   true if its a valid scale decimal number




## isScale(intervals) 

Determine if a given scale is a valid scale




### Parameters

- **intervals** `String`   - the array of intervals to test




### Returns


- `boolean`   true if its a valid scale intervals array




## notes() 

Get the notes of a scale






### Returns


- `Void`




## scaleSpace() 

Get the 2048 scales






### Examples

```javascript
scaleSpace() // => an array of 2048 binary numbers
```


### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
