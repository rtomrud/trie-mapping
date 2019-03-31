const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
const trie = trieMapping(JSON.parse(trieJSON));
const prefix = "prep";

module.exports = {
  name: "trie prefixed-with",
  fn() {
    const [string, branch] = trie.branchPrefixedWith(prefix);
    return Array.from(trieMapping(branch).entries(), ([key, value]) => [
      string + key,
      value
    ]);
  }
};
