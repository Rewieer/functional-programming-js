function Either() {}

Either.of = function(x) {
  return new Right(x);
}

function Right(x) {
  this.$value = x;
}

Right.of = function(x) {
  return new Right(x);
}

Right.prototype.map = function(fn) {
  return new Right(fn(this.$value));
}

Right.prototype.inspect = function() {
  return `Right {${this.$value}}`
};

function Left(x) {
  this.$value = x;
}

Left.of = function(x) {
  return new Left(x);
}

Left.prototype.map = function() {
  return this;
}

Left.prototype.inspect = function() {
  return `Left {${this.$value}}`
}

module.exports = {
  Either,
  Left,
  Right,
}
