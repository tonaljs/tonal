# pitch-class [![npm version](https://img.shields.io/npm/v/pitch-class.svg)](https://www.npmjs.com/package/pitch-class)

[![tonal](https://img.shields.io/badge/tonal-note--freq-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

Get the [pitch class](https://en.wikipedia.org/wiki/Pitch_class) of a note:

```js
var pc = require('pitch-class')
pc('a4') // => 'A'
pc('fx3') // => 'F##'
```

It works with midi numbers too:

```js
pc(57) // => 'A'
```

This is part of [tonal](https://github.com/danigb/tonal):

```js
tonal.pitchClass('bb2') // => 'Bb'
```


## License

MIT License
