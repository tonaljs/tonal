# tonal ![tonal](https://img.shields.io/badge/@tonaljs-modules-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)

`tonal`

Tonal library. This will install all `@tonaljs` packages.

**Note**: `tonal` is also found in `@tonaljs/tonal` package. Both contains the same exact code but the first one is recommended.

## Install

```bash
npm i --save tonal
# or
yarn add tonal
```

## Usage

Import:

```js
// ES6
import { Note, Key } from "tonal";
// node
const { Note, Key } = require("tonal");
// browser
const { Note, Key } = window.Tonal;
```

Use:

```js
Note.transpose("A4", "5P");
Key.majorKey("Gb");
```

See [README.md](/#documentation) for documentation.
