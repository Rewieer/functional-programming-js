const Box = x => ({
  map: fn => Box(fn(x)),
  fold: fn => fn(x),
  inspect: () => `Box(${x})`,
});

const Right = x => ({
  chain: fn => fn(x),
  map: fn => Right(fn(x)),
  fold: (_, g) => g(x)
});

const Left = x => ({
  chain: () => Left(x),
  map: () => Left(x),
  fold: (f, _) => f(x)
});

function fromNullable(x) {
  return x === null ? Left(x) : Right(x)
}

function tryCatch(fn) {
  try {
    return Right(fn());
  } catch (e) {
    return Left(e);
  }
}
function doDangerousAction(fn) {
  if (Math.random() < 0.5) {
    return fn;
  }

  throw new Error("Some bad case happened");
}

const identity = x => (y) => x !== undefined ? x : y;
const compose = (...fns) => fns.reverse().reduce((prev, next) => value => next(prev(value)), value => value);

fromNullable(10)
  .chain((x) => tryCatch(compose(doDangerousAction, identity(x))))
.map(x => x * 3)
.fold(
  e => console.error("Error ! " + e.message),
  s => console.log("Success : " + s)
);