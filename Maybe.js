function Maybe (x) {
  this.$value = x;
}

Maybe.of = function(x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
  return this.$value === null || this.$value === undefined;
}

Maybe.prototype.map = function(fn) {
  return this.isNothing() ? this : Maybe.of(fn(this.$value));
}

Maybe.prototype.inspect = function() {
  return this.isNothing() ? `Nothing` : `Maybe {${this.$value}}`;
}

module.exports = Maybe;
