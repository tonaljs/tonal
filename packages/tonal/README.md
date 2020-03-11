# @tonaljs/tonal ![tonal](https://img.shields.io/badge/@tonaljs-modules-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/tonal.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/tonal)

`@tonaljs/tonal`

Tonal library

## Install

```bash
npm i --save @tonaljs/tonal
# or
yarn add @tonaljs/tonal
```

## Usage

Import:

```js
// ES6
import { Note, Key } from "@tonaljs/tonal";
// node
const { Note, Key } = require("@tonaljs/tonal");
// browser
const { Note, Key } = window.Tonal;
```

Use:

```js
Note.transpose("A4", "5P");
Key.majorKey("Gb");
```

See [README.md](/#documentation) for documentation.
