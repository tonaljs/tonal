var interval = require('musical-interval')

for (var i = 0; i < 12; i++) {
  console.log(i, interval.names(i))
}
