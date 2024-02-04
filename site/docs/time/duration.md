---
title: Time duration
sidebar_position: 1
---

`@tonaljs/duration-value`

![tonal](https://img.shields.io/badge/@tonaljs-duration_value-yellow.svg?style=flat-square)
[![npm version](https://img.shields.io/npm/v/@tonaljs/duration-value.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/duration-value)

Functions to parse and manipulate time duration values

## Usage

ES6:

```js
import { DurationValue } from "tonal";
```

node:

```js
const { DurationValue } = require("tonal");
```

single module:

```js
import DurationValue from "@tonaljs/duration-value";
```

## Properties

### `DurationValue.get`

#### `get(name: string) // => object`

Get a duration value object from name:

```js
DurationValue.get("quarter"); // =>
// {
//   empty: false,
//   name: 'q',
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
//   name: 'q..',
//   value: 0.4375,
//   fraction: [ 7, 16 ],
//   shorthand: 'q',
//   dots: '..',
//   names: [ 'quarter', 'crotchet' ]
// }
```

Short names are accepted:

```js
DurationValue.get("q") == DurationValue.get("quarter");
DurationValue.get("q.") == DurationValue.get("quarter.");
DurationValue.get("q..") == DurationValue.get("quarter..");
```

Some aliases (`value` and `fraction`) are provided:

```js
DurationValue.value("q.."); // => 0.4375
DurationValue.fraction("q.."); // => [ 7, 16 ]
```

## List durations

### `DurationValue.names`

#### `names() => string[]`

Return all duration names

```js
DurationValue.names(); // => ["large", "duplex longa", ...]
```

### `DurationValue.shorthands`

#### `shorthands() => string[]`

Return all duration value shorthands

```js
DurationValue.shorthands(); // => ["dl", "l", "d", "w", "h", "q", "e", "s", "t", "sf", "h", "th"]
```

## References

- https://en.wikipedia.org/wiki/Note_value
