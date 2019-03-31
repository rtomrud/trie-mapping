const { readFileSync } = require("fs");
const { join } = require("path");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));
const map = new Map(JSON.parse(mapJSON));
const prefix = "pre";

module.exports = {
  name: "map prefixed-with-first",
  fn() {
    const { length } = prefix;
    let firstSuffix;
    map.forEach((value, key) => {
      if (
        key.slice(0, length) === prefix &&
        (!firstSuffix || key < firstSuffix)
      ) {
        firstSuffix = [key, value];
      }
    });
    return firstSuffix || [];
  }
};
