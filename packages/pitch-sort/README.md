# pitch-sort [![npm version](https://img.shields.io/npm/v/pitch-sort.svg)](https://www.npmjs.com/package/pitch-sort)

[![tonal](https://img.shields.io/badge/tonal-pitch-sort-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Sort a collection of notes or intervals. By default it sorts by ascending pitch order:

```js
var sort = require('pitch-sort')
sort(true, 'c2 d5 f0 gb g#2 db-1 c# ab2 h6 b3')
// => [null, 'C#', 'Gb', 'Db-1', 'F0', 'C2', 'G#2', 'Ab2', 'B3', 'D5']

```

You can install it via npm: `npm i --save pitch-sort`

This function is part of [tonal](https://github.com/danigb/tonal)
