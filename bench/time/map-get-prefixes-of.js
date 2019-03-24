const { readFileSync } = require("fs");
const { join } = require("path");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));
const map = new Map(JSON.parse(mapJSON));
const string = "maximally";

module.exports = {
  name: "map get-prefixes-of",
  fn() {
    const prefixesOf = [];
    map.forEach((value, key) => {
      const { length } = key;
      if (string.slice(0, length) === key) {
        prefixesOf.push([key, value]);
      }
    });
    return prefixesOf.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  }
};
