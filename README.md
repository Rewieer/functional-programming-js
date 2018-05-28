# Notes on Functional Programming

Functional programming is a paradigm promoting the usage of functions in it's
mathematical sense. It aims to provide a declarative way of coding, enhancing readability
and reusability (DRY).

**Functions** in computing, also known as procedure, are reusable bits of code. They can
have inputs, and outputs, but these are not mandatory. 

In math, a function is a black box that convert one or many input to a single output. These functions are
**pure** : for the same input, they provide the same output.

In Functional Programing, **we talk about functions as mathematical functions**. Followings these rules allows us
to take advantage of many mathematical rules that makes code cleaner.

## Parameters and Arguments
A function can accept one or many **parameters**. The amount of parameters a function can accept are called it's
**arity**. 
When we call a function, we provide **arguments**.
A function with an arity of :
* 0 is called a **Nullary**
* 1 is called an **Unary**
* 2 is called a **Binary**
* N is called a **n-ary**

```js
function sum(a, b) {
  return a + b;
}

sum(1, 2) // Outputs 3
sum(1) // Outputs NaN because b is undefined
```

To distinguish between these two :
* The function arity is always the same. Here, parameters are **a** and **b**
* The arguments passed vary at runtime. At first call, we passe 1 and 2. At second call, we pass only 1.

## Partial Application

Partial Application is the concept of providing some arguments to a function, but not all. 
```js
function sum(a, b) {
  return a + b;
}

let addOneTo = partial(sum, 1); 
addOneTo(3);
```

In this example, we partially apply sum by providing it's first argument : **1**. Therefore, our function looks
like this :

```js
function addOneTo() {
  return function(b) {
    return sum(1, b);
  }
}
```

Using partial application, we can create functions out of existing functions, with some of the first parameters
already provided. 
A more verbose example would be fetching data.

```js
function fetch(url, data, callback) {
  // Imagine fetching logic
}

// In this function, we provide fetch with the url
const fetchFromWebsite = partial(fetch, "https://mywebsite.com");
fetchFromWebsite({ userId: 1}, function() {
  // Some logic with the user fetched
})

// In this function, we provide the url and the data
const fetchCurrentUser = partial(fetch, "https://mywebsite.com", { userId: 1 });
fetchCurrentUser(function() {
  // Some logic with the user fetched
})

// We can do it even more concisely
const fetchCurrentUser = partial(fetchFromWebsite, { userId: 1 });
fetchCurrentUser(function() {
  // Some logic with the user fetched
})
```

In this example we start to understand how it makes code clearer. Which is better ?
```js
fetch("https://mywebsite.com", { userId: 1 }, function() {
  // Some logic with the user fetched
})
fetchCurrentUser(function() {
  // Some logic with the user fetched
})
```

The first example rely on the implementation of fetch in which we provide a lot of arguments. Usually, in a big project,
the URL would be given way prior to the actual call to handle various environments (a production site and a development site).

The second example is verbose and straight-forward : required arguments are passed before, so we don't need to take care of
them. Moreover, it says what it's doing : it fetches the user. This is the main benefit of functional programming : 
**it focuses on the result, not on how to get it**.

### Currying

A special case of Partial Application is called Currying. It consist of partially applying one argument at a time.
Our fetch example would look like it :
```js
const myFetch = curry(fetch);
myFetch("https://mywebsite.com")({ userId: 1 })(function() {
  // Some logic with the user fetched
})
```

Why would one do this ? It appears that functional programming really is efficient when we talk about functions
expecting a single input (more about this later).  
## Standard Functions
**Identity** : returns it's input as the output

**Unary** : Accepts only one argument.

**Constant** : always return the same constant value