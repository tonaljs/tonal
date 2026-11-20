# Time duration

Functions to parse and manipulate time duration values

```js
import { DurationValue } from "tonal";

DurationValue.get("quarter").value; // => 0.25
```

## Properties

### `DurationValue.get`

`get(name: string) => DurationValue`

Get a duration value object from name:

```js
DurationValue.get("quarter"); // =>
// {
//   empty: false,
//   name: 'quarter',
//   value: 0.25,
//   fraction: [ 1, 4 ],
//   shorthand: 'q',
//   dots: '',
//   names: [ 'quarter', 'crotchet' ]
// }
```

The name accepts an arbitrary number of dots:

```js
DurationValue.get("quarter.."); // =>
// {
//   empty: false,
//   name: 'quarter..',
//   value: 0.4375,
//   fraction: [ 7, 16 ],
//   shorthand: 'q',
//   dots: '..',
//   names: [ 'quarter', 'crotchet' ]
// }
```

Short names are accepted:

```js
DurationValue.get("q").value; // => 0.25
DurationValue.get("q.").value; // => 0.375
DurationValue.get("q..").value; // => 0.4375
```

Some aliases (`value` and `fraction`) are provided:

```js
DurationValue.value("q.."); // => 0.4375
DurationValue.fraction("q.."); // => [ 7, 16 ]
```

## List durations

### `DurationValue.names`

`names() => string[]`

Return all duration names

```js
DurationValue.names(); // => ["large", "duplex longa", ...]
```

### `DurationValue.shorthands`

`shorthands() => string[]`

Return all duration value shorthands

```js
DurationValue.shorthands(); // => ["dl", "l", "d", "w", "h", "q", "e", "s", "t", "sf", "ht", "th"]
```

## References

- https://en.wikipedia.org/wiki/Note_value
