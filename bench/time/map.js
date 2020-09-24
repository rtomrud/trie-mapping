const { readFileSync } = require("fs");
const { join } = require("path");
const { Suite } = require("benchmark");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));
const map = new Map(JSON.parse(mapJSON));

const prefixedWith = (map, prefix) => {
  const { length } = prefix;
  const entries = [];
  map.forEach((value, key) => {
    if (key.slice(0, length) === prefix) {
      entries.push([key, value]);
    }
  });
  return entries.sort(([a], [b]) => (a < b ? -1 : 1));
};

Suite()
  .add("map prefixed-with", () => prefixedWith(map, "prepar"))
  .on("cycle", ({ target: { name, hz, stats } }) =>
    console.log(name, hz.toFixed(2), `±${stats.rme.toFixed(2)}`)
  )
  .run();
