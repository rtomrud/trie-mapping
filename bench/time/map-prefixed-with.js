const { readFileSync } = require("fs");
const { join } = require("path");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));
const map = new Map(JSON.parse(mapJSON));

module.exports = {
  name: "map prefixed-with",
  fn() {
    // Find all entries whose key is prefixed with the given prefix
    const prefix = "prepar";
    const { length } = prefix;
    const prefixedWith = [];
    map.forEach((value, key) => {
      if (key.slice(0, length) === prefix) {
        prefixedWith.push([key, value]);
      }
    });
    return prefixedWith.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  },
};
