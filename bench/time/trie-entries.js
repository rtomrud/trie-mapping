const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
const trie = trieMapping(JSON.parse(trieJSON));

module.exports = {
  name: "trie entries",
  fn() {
    return [...trie.entries()];
  },
};
