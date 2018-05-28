function identity(v) {
  return v;
}

function constant(v) {
  return function value() {
    return v;
  }
}
function unary(fn) {
  return function unaryFn(value) {
    return fn(value);
  }
}

function spreadArgs(fn) {
  return function spreadFn(args) {
    return fn(...args);
  }
}

function gatherArgs(fn) {
  return function gatherFn(...args) {
    return fn(args);
  }
}

function partial(fn, ...firstArgs) {
  return function partiallyApplied(...lastArgs) {
    return fn(...firstArgs, ...lastArgs);
  }
}

function reverseArgs(fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse());
  }
}

function partialRight(fn, ...firstArgs) {
  return function partiallyApplied(...lastArgs) {
    return fn(...lastArgs, ...firstArgs);
  }
}

function curry(fn, arity = fn.length) {
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
}

function uncurry(fn) {
  return function uncurried(...args) {
    let ret = fn;
    for (let arg of args) {
      ret = ret(arg);
    }

    return ret;
  }
}

function not(fn) {
  return function negated(...args) {
    return !fn(...args);
  }
}

function when(predicate, fn) {
  return function conditional(...args) {
    if (predicate(...args)) {
      return fn(...args);
    }
  }
}
// Identity
(function() {
  var words = "   Oh ok i see...   ".split(/\s|\b/);
  console.log(words.filter(identity)); // Outputs ["Oh","ok","i","see"]
});

// Unary
(function() {
  var values = ["1", "4", "8"];
  console.log(values.map(unary(parseInt))); // Outputs 1, 4, 8
});

// Spread
(function() {
  function sum(a, b) {
    return a + b;
  }
  console.log(spreadArgs(sum)([1,2])); // Outputs 3
});

// Gather
(function() {
  function sum(array) {
    return array[0] + array[1];
  }

  console.log(gatherArgs(sum)(1, 2)); // Outputs 3
});

// Partial Application
(function() {
  function doRequest(url, data, callback) {
    callback({ url, data });
  }

  doRequest("https://monsite.com", { userId: 1 }, console.log); // { url: https://monsite.com, userId: 1 }

  const requestOnMySite = partial(doRequest, "https://monsite.com");
  requestOnMySite({ userId: 1 }, console.log); // { url: https://monsite.com, userId: 1 }

  const fetchUser = partial(requestOnMySite, { userId: 1 });
  fetchUser(console.log); // { url: https://monsite.com, userId: 1 }

});

// Reverse args and partialRight
(function() {
  function sum(a, b, c) {
    return a * (b + c);
  }

  console.log(sum(1, 2, 3)); // Outputs 1 + (2 * 3) => 5
  console.log(reverseArgs(sum)(1, 2, 3)); // Outputs 3 * (2 + 1) => 9

  function doRequest(url, data, callback) {
    callback({ url, data });
  }

  // In this case, we reverse the arguments for the doRequest. Therefore, we must provide
  // callback, data, url
  // We partially apply it so we now only have to provide the data and the url
  let logger = partial(reverseArgs(doRequest), function(data) {
    console.log(data);
  });

  logger({ userId: 1 }, "https://monsite.com"); // { url: https://monsite.com, userId: 1 }

  // In order to restore our arguments order, we must apply a whole reverse to the result
  logger = reverseArgs(logger);
  logger("https://monsite.com", { userID: 1 }); // { url: https://monsite.com, userId: 1 }

  logger = partialRight(doRequest, function(data) {
    console.log(data);
  });

  logger("https://monsite.com", { userID: 1 }); // { url: https://monsite.com, userId: 1 }
});

// Currying and Uncurrying
(function() {
  function doRequest(url, data, callback) {
    callback({ url, data });
  }

  let curried = curry(doRequest);
  let uncurried = uncurry(curried);

  curried("https://monsite.com")({ userId: 1 })(console.log); // { url: https://monsite.com, userId: 1 }

  uncurried("https://monsite.com", { userId: 1}, console.log); // { url: https://monsite.com, userId: 1 }
  uncurried("https://monsite.com", { userId: 1})(console.log); // { url: https://monsite.com, userId: 1 }
  uncurried("https://monsite.com")({ userId: 1})(console.log); // { url: https://monsite.com, userId: 1 }
});

// Point Free
(function() {
  function log(txt) {
    console.log(txt);
  }

  function printIf(predicate, txt) {
    if (predicate(txt)) {
      log(txt);
    }
  }

  function isShortEnough(str) {
    return str.length <= 5;
  }

  const isLongEnough = not(isShortEnough);

  printIf(isShortEnough, "Salut"); // Prints it
  printIf(isShortEnough, "Salut !!"); // Prints NOTHING
  printIf(isLongEnough, "Salut !!"); // Prints it
  printIf(isLongEnough, "Salut"); // Prints NOTHING

  // Point Free

  const logWhen = partialRight(when, log);
  logWhen(isShortEnough)("Salut !"); // Prints "Salut !"
  logWhen(isLongEnough)("Salut !"); // Prints NOTHING
  const printIfPointFree = uncurry(logWhen);

  printIfPointFree(isShortEnough, "Salut"); // Prints it
  printIfPointFree(isShortEnough, "Salut !!"); // Prints NOTHING
  printIfPointFree(isLongEnough, "Salut !!"); // Prints it
  printIfPointFree(isLongEnough, "Salut"); // Prints NOTHING
})();