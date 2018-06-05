const fp = require("./utils");
const compose = fp.compose;
const partial = fp.partial;
const curry = fp.curry;
const partialRight = fp.partialRight;
const not = fp.not;

const split = (by, str) => str.split(by);
const join = (by, array) => array.join(by);
const filter = (fn, array) => array.filter(fn);
const indexOf = (value, array) => array.indexOf(value);
const equals = (a, b) => a === b;
const unique = (value, index, array) => equals(indexOf(value, array), index);
const logger = (val) => {
  console.log("[LOGGER]", val);
  return val;
};

const splitIntoWords = partial(split, " ");
const getUniqueValues = curry(filter)(unique);
const joinWords = partial(join, " ");

const uniqueWords = compose(
  joinWords,
  getUniqueValues,
  splitIntoWords
);

console.log(uniqueWords("the little dog and the big cat"));

const length = (value) => value.length;
const isGreaterOrEqualThan = (a, b) => a >= b;
const isLowerOrEqualThan = (a, b) => a <= b;
const isStringLengthLowerOrEqualThan = (minLength, value) => isLowerOrEqualThan(length(value), minLength);
const isStringLengthLowerThanFive = partial(isStringLengthLowerOrEqualThan, 5);
const isStringLengthBiggerThanFive = partial(not(isStringLengthLowerOrEqualThan), 5);

const skipLongWords = partial(filter, isStringLengthLowerThanFive);
const skipShortWords = partial(filter, isStringLengthBiggerThanFive);

const filterWords = partialRight(compose, getUniqueValues, splitIntoWords);
const longerWords = filterWords(skipShortWords);
const shorterWords = filterWords(skipLongWords);

console.log(shorterWords("the little dog and the big cat"));
console.log(longerWords("the little dog and the big cat"));