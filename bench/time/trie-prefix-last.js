const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
const trie = trieMapping(JSON.parse(trieJSON));
const string = "maximally";

module.exports = {
  name: "trie prefix-last",
  fn() {
    const [prefix, branch] = trie.branchOfLastPrefix(string);
    return [prefix, branch[""]];
  }
};
