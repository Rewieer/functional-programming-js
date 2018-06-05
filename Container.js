function Container(x) {
  this.$value = x;
}

Container.of = function(x) {
  return new Container(x);
}

Container.prototype.map = function(f) {
  return Container.of(f(this.$value));
}

Container.prototype.inspect = function() {
  return `Container { ${this.$value} }`;
}

module.exports = Container;
