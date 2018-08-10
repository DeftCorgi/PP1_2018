// keys will be kept in this file. dependign on ENV
// will either export production or dev keys

if (process.env.ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}