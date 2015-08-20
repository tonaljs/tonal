# data 




## listDict(data, parser) 

Create a list dictionary from a hash map data and a name parser

A list dictionary is a function that generates lists from keys. It uses
a parser to remove the tonic (if present) from the key. Then look up
into the hash for a name and pass it to a list generator.

If the returned dictionary is called without arguments, a list of all keys
is returned

If the name is not found in the hash data, it throws an exception

The parser should receive one string and return an object with two string
properties:
- tonic: a note if any, or null
- type: (required) the key to lookfor

The scale/scale and chord/chord functions uses this to create a generator.


### Parameters

- **data** `Hash`   - the data hash (dictionary)
- **parser** `Function`   - a function that parses the name and returns an object with tonic (if not present) and the name properties




### Examples

```javascript
var listDict = require('tonal/data/listDict')
var scale = listDict({'major': 2773})
scale('C major') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
scale('major') // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
// get keys:
scale() // => ['major']
```


### Returns


- `Function`   the list dictionary




## names(hash) 

Given a data hash, return the keys




### Parameters

- **hash** `Hash`   - the data hash




### Returns


-   




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
