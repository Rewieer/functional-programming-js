const { concat, prop, map, compose, curry, identity } = require("ramda");
const Container = require("./Container");
const Maybe = require("./Maybe");
const { Either, Left, Right } = require("./Either");
const IO = require("./IO");

const double = (value) => value * 2;
const castToString = (value) => value.toString();
const addText = curry((text, value) => value + text);

const toEuros = compose(addText("€"), castToString, double);
const maybe = curry((nothingValue, fn, maybeValue) => {
  if (maybeValue.isNothing()) {
    return nothingValue;
  }

  return fn(maybeValue.$value);
});

const safeToEuros = compose(
  map(toEuros),
  Maybe.of
)

// console.log(safeToEuros(50)); // Maybe {100€}
// console.log(safeToEuros(null)); // Nothing

const withDraw = curry((amount, account) => Maybe.of(account.balance >= amount ? { balance: account.balance - amount } : null));
const getBalance = (account) => `Your balance is ${account.balance}€`;

const safeWithdraw = compose(
  maybe("You're broke!", getBalance),
  withDraw(100)
);

// console.log(safeWithdraw({ balance: 150 })); // Your balance is 50€
// console.log(safeWithdraw({ balance: 50 })); // You're broke!

const getAge = function(user) {
  try {
    if (typeof user.age !== "number")
      throw new Error("'age' must be a number");

    return Right.of(user.age);
  } catch (e) {
    return Left.of(e.message);
  }
}

const doubleAge = compose(
  map((age) => age * 2),
  getAge
);

const either = curry((f, g, e) => {
  if (e.constructor === Left) {
    return f(e.$value);
  }

  return g(e.$value);
})
// console.log(doubleAge({ age: 18 })); // Right {36}
// console.log(doubleAge()); // Left {Cannot read property 'age' of undefined}
// console.log(doubleAge({})); // Left {'age' must be a number}

const printAge = compose(
  either(concat("Error : "), identity),
  doubleAge
);

// console.log(printAge({ age: 18 })); // 36
// console.log(printAge());

const runIo = (io, ...args) => io.$value(...args);

const readFileIo = new IO((arg) => arg + "!").map(console.log);
runIo(readFileIo, "foo");
