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
letters and dots (`"q."`, `"w.."`) or names (`"quarter"`).
See tonal/time/duration-value

If the duration is not specified, and there's no measure separator,
the default duration is 4. But if there are any measure separators, i
the duration is calculated by dividing the measure length by the number
of items. You can use parenthesis to group items and write complex
rhythmic structures:

```js
parse('a b c d |'); // duration: 0.25, 0.25, 0.25, 0.25
parse('a (b c)'); // durations: 0.5, 0.25, 0.25
parse('a b (c d e)'); // durations: q, q, qt, qt, qt
parse('(a _ _ b) (c d)') // durations: 0.375, 0.125, 0.25, 0.25
```

The `_` symbol extends the duration of the previous item:

```js
parser'Cm | _ ');
// [{ value: 'Cm', position: 0, duration: 2 }]
parse('c d _ e | f _ _ g');
// [{ value: 'c', position: 0,    duration: 0.25 }]
// [{ value: 'd', position: 0.25, duration: 0.50 }]
// [{ value: 'e', position: 0.75, duration: 0.25 }]
// [{ value: 'f', position: 1,    duration: 0.75 }]
// [{ value: 'g', position: 1.75, duration: 0.25 }]
```

You can specify other time signatures (it's 4/4 by default):

```js
parse('Cm | D0 G7 | Cm', '6/8');
parse('C | D / G | C', '3/4');
```

It returns an array in the form { pos: integer, dur: integer, val: object }


### Parameters

- **measures** `String`   - the string measures to be parsed
- **options** `Object`   - parsing options




### Examples

```javascript
sequence = require('tonal/score/sequence')
```


### Returns


- `Array`   - an array of obects with the form { pos: position, dur: duration, val: value }




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
