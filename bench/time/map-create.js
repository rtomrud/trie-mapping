const { readFileSync } = require("fs");
const { join } = require("path");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));

module.exports = {
  name: "map create",
  fn() {
    return new Map(JSON.parse(mapJSON));
  }
};
