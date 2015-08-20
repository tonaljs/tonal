# time 




## durationName(value) 

Given a [note value](https://en.wikipedia.org/wiki/Note_value) get its name




### Parameters

- **value** `Float`   - the note value




### Examples

```javascript
var name = require('tonal/time/duration-name')
name(1/2 + 1/4)        // => 'h.'
name(1/4 + 1/2 + 1/8)  // => 'q..'
```


### Returns


- `String`   The name (expressed with letters and dots) of that value




## durationValue(name) 

Given a note duration name, get its [value](https://en.wikipedia.org/wiki/Note_value)




### Parameters

- **name** `String`   - the duration name. Can be expressed with standard names ('long', 'double'), with letters and dots ('q', 'q..') or number strings with
dots ('2.', '4..')




### Examples

```javascript
var value = require('tonal/time/duration-value')
// You can convert from names to values:
value('long');          // => 4
value('double');         // => 2
value('whole');          // => 1
value('half');           // => 1/2
value('quarter');        // => 1/4
value('eighth');         // => 1/8
value('sixteenth');      // => 1/16
value('thirty-second');  // => 1/32

// From letter and dots to values:
value('h');   // => 1/2
value('h.');  // => dot: 1/2 + 1/4
value('h..'); // => double dot: 1/2 + 1/4 + 1/8
value('ht');  // => triplet: (1/2 + 1/ 2) / 3
value('q');   // => 1/4
value('q.');  // => dot: 1/4 + 1/8
value('q..'); // => double dot: 1/4 + 1/8 + 1/16
value('qt');  // => triplet: (1/4 + 1/4) / 3

// From number string to value:
value('2');   // => 1/2
value('2.');  // => dot: 1/2 + 1/4
value('2t');  // => triplet: (1/2 + 1/ 2) / 3
value('2..'); // => double dot: 1/2 + 1/4 + 1/8
value('4');   // => 1/4
value('4.');  // => dot: 1/4 + 1/8
value('4..'); // => double dot: 1/4 + 1/8 + 1/16
value('4t');  // => triplet: (1/4 + 1/4) / 3
```


### Returns


- `Float`   the duration value




## timeMeter(meter) 

Parse a time meter signature

The returned time meter object has the following properties:
- beats: number of beats per measure (integer)
- subdivision: the meter subdivision (4 or 8)
- measure: the length (in duration value) of the measure


### Parameters

- **meter** `String`   - the string representing the time meter




### Returns


- `Object`   a time meter object




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
