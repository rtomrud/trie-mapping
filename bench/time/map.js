import { readFileSync } from "fs";
import benchmark from "benchmark";

const { Suite } = benchmark;

const data = readFileSync(new URL("../data/map.json", import.meta.url));
const map = new Map(JSON.parse(data));

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
