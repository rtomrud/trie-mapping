const { readFileSync } = require("fs");
const { join } = require("path");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));
const map = new Map(JSON.parse(mapJSON));

module.exports = {
  name: "map for-each",
  fn() {
    map.forEach(() => {});
  }
};
