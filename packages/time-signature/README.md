# @tonaljs/time-signature ![tonal](https://img.shields.io/badge/@tonaljs-time_signature-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/time-signature.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/time-signature)

> Functions to parse time signatures

## Usage

ES6:

```js
import { TimeSignature } from "@tonaljs/tonal";
```

node:

```js
const { TimeSignature } = require("@tonaljs/tonal");
```

single module:

```js
import TimeSignature from "@tonaljs/time-signature";
```

## API

#### `TimeSignature.names() => string[]`

Return a list of most most frequently-used time signatures:

```js
TimeSignature.names();
```

#### `TimeSignature.get(name: string) // => object`

Get a time signature object from array or string:

```js
TimeSignature.get("3/4"); // =>
```

## References

- https://en.wikipedia.org/wiki/Time_signature
