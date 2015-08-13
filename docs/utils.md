# utils 




## dictionary(data, func, position) 

Apply a dictionary to a function parameter

This function decorates anotehr one by substituting a parameter with a
lookup into a hashmap


### Parameters

- **data** `Hash`   - the hashmap with data
- **func** `Function`   - the function to be decorated
- **position** `Integer`   - (Optional) the argument position to be replaced. It's 0 by default




### Examples

```javascript
var intervals = require('notelab/scale/intervals')
dictionary({ major: 2773 }, intervals)
intervals('major') => ['P1', 'M2', ...]
```


### Returns


- `Function`   the decorated function




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
