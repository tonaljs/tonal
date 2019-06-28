# @tonaljs/interval ![tonal](https://img.shields.io/badge/@tonaljs-interval-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/interval.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/interval)

> A collection of functions to create and manipulate music intervals

## API

### `names() => string[]`

Return a list of (natural) interval names:

```js
names(); // => ["1P", "2M", "3M", "4P", "5P", "6m", "7m"]
```

### `fromSemitones(semitones: number) => string`

Given a number of semitones, returns the interval name:

```js
fromSemitones(7); // => "5P"
fromSemitones(-7); // => "-5P"
```

### `simplify(interval: string) => string`

Simplify an interval:

```js
simplify("9M"); // => "2M"
["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(simplify);
// => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
simplify("2M"); // => "2M"
simplify("-2M"); // => "7m"
```

### `invert(interval: string) => string`

Get the interval inversion:

```js
invert("3m"); // => "6M"
invert("2M"); // => "7m"
```

### `add(a: string, b: string) => string`

Add two intervals:

```js
add("3m", "5P"); // => "7m"
```

### `substract(min: string, sub: string) => string`

Substract two intervals:

```js
substract("5P", "3M"); // => '3m'
substract("3M", "5P"); // => '-3m'
```
