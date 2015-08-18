# data 




## names(hash) 

Given a data hash, return the keys




### Parameters

- **hash** `Hash`   - the data hash




### Returns


-   




## setGenerator(data, parser) 

Create a set generator from a hash map data and a name parser

A set generator is a function that generates sets from strings. It uses
a parser to separate the tonic (if any) from the real name. Then look up
into the hash for a name and pass it to a set generator.

If the name is not found in the hash data, it throws an exception

The scale/scale and chord/chord functions uses this to create a generator.


### Parameters

- **data** `Hash`   - the data hash (dictionary)
- **parser** `Function`   - a function that parses the name and returns an object with tonic (if not present) and the name properties




### Examples

```javascript
var setGenerator = require('tonal/data/set-generator')
var scale = setGenerator({'major': 2773})
scale('C major') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
scale('major') // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
```


### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
