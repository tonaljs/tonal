---
title: Time signatures
package: time-signature
---

Functions to parse time signatures

```js
import { TimeSignature } from "tonal";
```

## API

### `TimeSignature.names`

`names() => string[]`

Return a list of most most frequently-used time signatures:

```js
TimeSignature.names();
```

### `TimeSignature.get`

`get(name: string | [number, number]) // => object`

Get a time signature:

```js
TimeSignature.get("3/4"); // =>
// {
//   empty: false,
//   name: "3/4",
//   upper: 3,
//   lower: 4,
//   type: "simple",
//   additive: []
// };
```

`type` can be `simple`, `compound`, `regular`, `irregular` or `irrational`

Additive signatures are accepted:

```js
TimeSignature.get("3+2+3/8"); // =>
// {
//   empty: false,
//   name: '3+2+3/8',
//   type: 'irregular',
//   upper: 8,
//   lower: 8,
//   additive: [ 3, 2, 3 ]
// }
```

Irrational signatures are also interpreted:

```js
TimeSignature.get("12/10"); // =>
// {
//   empty: false,
//   name: '12/10',
//   type: 'irrational',
//   upper: 12,
//   lower: 10,
//   additive: []
// }
```

Arrays can be passed as arguments:

```js
TimeSignature.get([3, 4]);
TimeSignature.get(["3", "4"]);
TimeSignature.get(["3+2+3", "8"]);
```

## References

- https://en.wikipedia.org/wiki/Time_signature
- https://en.wikipedia.org/wiki/Metre_(music)
