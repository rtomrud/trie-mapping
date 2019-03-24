const { readFileSync } = require("fs");
const { join } = require("path");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));
const map = new Map(JSON.parse(mapJSON));
const prefix = "un";

module.exports = {
  name: "map get-prefixed-with",
  fn() {
    const { length } = prefix;
    const prefixedWith = [];
    map.forEach((value, key) => {
      if (key.slice(0, length) === prefix) {
        prefixedWith.push([key, value]);
      }
    });
    return prefixedWith.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  }
};
