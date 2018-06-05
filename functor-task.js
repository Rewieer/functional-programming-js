const fs = require("fs");
const { task } = require("folktale/concurrency/task");

const readFile = (filename) => task((resolver) => {
  fs.readFile(filename, (err, data) => err ? resolver.reject(err) : resolver.resolve(data.toString()));
});

const jsonToObject = JSON.parse;

const readFileAction = readFile("./dummy.json")
.map(jsonToObject)
.map(result => console.log(result));

readFileAction.run();
