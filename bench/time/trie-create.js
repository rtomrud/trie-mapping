const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));

module.exports = {
  name: "trie create",
  fn() {
    return trieMapping(JSON.parse(trieJSON));
  }
};
