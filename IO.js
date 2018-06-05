const { compose } = require("ramda");

function IO(x) {
  this.$value = x;
}

IO.of = function(x) {
  return new IO(() => x);
}

IO.prototype.map = function(fn) {
  return new IO(compose(fn, this.$value));
}

IO.prototype.inspect = function() {
  return `IO {${this.$value}}`;
}

module.exports = IO;
