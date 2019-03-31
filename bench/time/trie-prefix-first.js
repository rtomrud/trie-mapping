const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
const trie = trieMapping(JSON.parse(trieJSON));
const string = "maximally";

module.exports = {
  name: "trie prefix-first",
  fn() {
    const [prefix, branch] = trie.branchOfFirstPrefix(string);
    return [prefix, branch[""]];
  }
};
