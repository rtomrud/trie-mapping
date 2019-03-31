const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
const trie = trieMapping(JSON.parse(trieJSON));
const prefix = "pre";

module.exports = {
  name: "trie prefixed-with-first",
  fn() {
    const [string, branch] = trie.branchPrefixedWith(prefix);
    const [key, value] = trieMapping(branch)
      .entries()
      .next().value;
    return [string + key, value];
  }
};
