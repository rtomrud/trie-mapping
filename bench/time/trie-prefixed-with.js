const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const { hasOwnProperty } = Object.prototype;
const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
const trie = trieMapping(JSON.parse(trieJSON));

module.exports = {
  name: "trie prefixed-with",
  fn() {
    // Find all entries whose key is prefixed with the given prefix
    const { root } = trie;
    const prefix = "prepar";
    const { length } = prefix;
    let node = root;
    let start = 0;
    let end = 1;
    let key;
    while (end <= length) {
      key = prefix.substring(start, end);
      if (hasOwnProperty.call(node, key)) {
        node = node[key];
        start = end;
      }

      end += 1;
    }

    let string;
    if (start < length) {
      const suffix = prefix.substring(start);
      const { length } = suffix;
      for (const key in node) {
        if (
          hasOwnProperty.call(node, key) &&
          key.substring(0, length) === suffix
        ) {
          string = prefix.substring(0, prefix.length - suffix.length) + key;
          node = node[key];
          break;
        }
      }
    } else if (node !== root || hasOwnProperty.call(node, prefix)) {
      string = prefix;
    }

    if (string == null) {
      return [];
    }

    return Array.from(trieMapping(node).entries(), ([key, value]) => [
      string + key,
      value,
    ]);
  },
};
