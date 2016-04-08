# enharmonics [![npm](https://img.shields.io/npm/v/enharmonics.svg)](https://www.npmjs.com/package/enharmonics)

[![license](https://img.shields.io/npm/l/enharmonics.svg)](https://www.npmjs.com/package/enharmonics)
[![tonal](https://img.shields.io/badge/tonal-enharmonics-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Get note lower and upper enhamonics for a given note:

```js
var enharmonics = require('enharmonics')
enharmonics('B#') // => [ 'A###', 'B#', 'C' ]
```

Additionally, you can simplify a note:

```js
enharmonics.simplify('B#3') // => 'C4'
```

This is part of [tonal](https://github.com/danigb/tonal)

## Installation

Install via npm: `npm install --save enharmonics`

## License

MIT License
