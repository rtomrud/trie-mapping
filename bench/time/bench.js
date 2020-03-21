const { readdir } = require("fs");
const { resolve } = require("path");
const { promisify } = require("util");
const { Suite } = require("../../node_modules/benchmark/benchmark.js");

const readdirPromise = promisify(readdir);

const [, , ...paths] = process.argv;

const allFilenamesInDirname = () =>
  readdirPromise(__dirname).then(paths =>
    paths.map(path => resolve(__dirname, path))
  );

Promise.resolve(
  paths.length > 0 ? paths.map(path => resolve(path)) : allFilenamesInDirname()
).then(filename => {
  const suite = Suite({
    onCycle: ({ target: { name, hz, stats } }) =>
      console.log(name, hz.toFixed(2), `±${stats.rme.toFixed(2)}`),
    onError: console.error
  });
  filename
    .filter(filename => filename !== __filename)
    .forEach(filename => suite.add(require(filename)));
  suite.run();
});
