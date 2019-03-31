const { readFileSync } = require("fs");
const { join } = require("path");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));
const map = new Map(JSON.parse(mapJSON));
const string = "maximally";

module.exports = {
  name: "map prefix-first",
  fn() {
    const { length } = string;
    let index = 0;
    while (index <= length) {
      const key = string.slice(0, index);
      // Check if the value is in the map, since the trie does so
      if (map.has(key)) {
        return [key, map.get(key)];
      }

      index += 1;
    }

    return [];
  }
};
