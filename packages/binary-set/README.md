# binary-set [![npm](https://img.shields.io/npm/v/binary-set.svg)](https://www.npmjs.com/package/binary-set)

[![license](https://img.shields.io/npm/l/binary-set.svg)](https://www.npmjs.com/package/binary-set)
[![tonal](https://img.shields.io/badge/tonal-binary--set-yellow.svg)](https://www.npmjs.com/package/tonal)


`binary-set` is a collection of javascript functions to manipulate binary sets. Binary sets are binary representations of pitch sets and are very useful to compare them (among other things).

```js
var binarySet = require('binary-set')
binarySet('C D E F G A B') // => { binary: '101011010101', decimal: 2773 }
```

This is part of [tonal](https://www.npmjs.com/package/tonal).

## Install

Only via npm: `npm i --save binary-set`

## License

MIT License
