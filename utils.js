module.exports = {
  compose(...fns) {
    return function composed(result) {
      var list = [...fns];
      while (list.length > 0) {
        result = list.pop()(result);
      }
      return result;
    };
  },
  identity(v) {
    return v;
  },
  constant(v) {
    return function value() {
      return v;
    }
  },
  unary(fn) {
    return function unaryFn(value) {
      return fn(value);
    }
  },
  spreadArgs(fn) {
    return function spreadFn(args) {
      return fn(...args);
    }
  },
  gatherArgs(fn) {
    return function gatherFn(...args) {
      return fn(args);
    }
  },
  partial(fn, ...firstArgs) {
    return function partiallyApplied(...lastArgs) {
      return fn(...firstArgs, ...lastArgs);
    }
  },
  reverseArgs(fn) {
    return function argsReversed(...args) {
      return fn(...args.reverse());
    }
  },
  partialRight(fn, ...firstArgs) {
    return function partiallyApplied(...lastArgs) {
      return fn(...lastArgs, ...firstArgs);
    }
  },
  curry(fn, arity = fn.length) {
    return (function nextCurried(prevArgs) {
      return function curried(nextArg) {
        const totalArgs = [...prevArgs, nextArg];
        if (totalArgs.length >= arity) {
          return fn(...totalArgs);
        } else {
          return nextCurried(totalArgs);
        }
      }
    })([]);
  },
  uncurry(fn) {
    return function uncurried(...args) {
      let ret = fn;
      for (let arg of args) {
        ret = ret(arg);
      }

      return ret;
    }
  },
  not(fn) {
    return function negated(...args) {
      return !fn(...args);
    }
  },
  when(predicate, fn) {
    return function conditional(...args) {
      if (predicate(...args)) {
        return fn(...args);
      }
    }
  },
};