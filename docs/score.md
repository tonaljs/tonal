# score 




## sequence(measures, options) 

Create an array of events from a string representation of a sequence

You can parse measures separated with '|' where the time of each measure
is evenly distributed between the elements inside the measure:

```js
parse('Cm | D0 G7 | Cm');
// [{ value: 'Cm', position: 0,   duration: 1 },
//  { value: 'D0', position: 1,   duration: 0.5  },
//  { value: 'G7', position: 1.5, duration: 0.5  },
//  { value: 'Cm', position: 2,   duration: 1  }
```

You can specify durations:
```js
var melody = parse('a2/4 b2/4 c#3/8 d3/8');
// [{ value: 'a2',  position: 0,      duration: 0.25 },
//  { value: 'b2',  position: 0.25,   duration: 0.25 },
//  { value: 'c#3', position: 0.5,    duration: 0.125 },
//  { value: 'd3',  position: 0.625,  duration: 0.125 }]
```
The duration can be expressed with numbers and dots (`"4."`, `"2.."`), with
letters and dots (`"q."`, `"w.."`) or names (`"quarter"`)


### Parameters

- **measures** `String`   - the string measures to be parsed
- **options** `Object`   - parsing options




### Examples

```javascript
sequence = require('tonal/score/sequence')
```


### Returns


- `Array`   - an array of obects with the form { pos: position, dur: duration, val: value }




## parenthesize() 

The following code is copied from https://github.com/maryrosecook/littlelisp
See: http://maryrosecook.com/blog/post/little-lisp-interpreter
Thanks Mary Rose Cook!






### Returns


- `Void`




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
