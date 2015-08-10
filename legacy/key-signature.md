# key-signature

Create [key signatures](https://en.wikipedia.org/wiki/Key_signature) to query properties:

```js
var KeySignature = require('key-signature')
var keyD = KeySignature('D')
key.alterations // => '##'
var keyF = KeySignature(-1)
keyF.tonic // => 'F'
```

## API

### KeySignature(note | number)
