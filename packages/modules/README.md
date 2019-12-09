# @tonaljs/modules ![tonal](https://img.shields.io/badge/@tonaljs-modules-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/modules.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/modules)

`@tonaljs/modules`

Tonal modules is a package with all tonaljs modules bundled for covenience.


## Install

```bash
npm i --save @tonaljs/modules
# or
yarn add @tonaljs/modules
```

## Usage

With ES6 `import`:

```js
import { Tonal, Key } from '@tonaljs/modules';
Tonal.tranpose('A4', '5P')
Key.majorKey('Gb')
```

With ES5 `require`:

```js
const { Tonal, Key } = require('@tonaljs/modules');
Tonal.tranpose('A4', '5P')
Key.majorKey('Gb')
```

