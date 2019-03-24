const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
const trie = trieMapping(JSON.parse(trieJSON));
const prefix = "un";

module.exports = {
  name: "trie get-prefixed-with",
  fn() {
    return trie.getPrefixedWith(prefix);
  }
};
