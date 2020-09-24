const { readFileSync } = require("fs");
const { join } = require("path");
const { Suite } = require("benchmark");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
const trie = trieMapping(JSON.parse(trieJSON));

const collect = (node, prefix, results) => {
  for (const key in node) {
    if (key === "") {
      results.push([prefix, node[key]]);
    } else {
      collect(node[key], prefix + key, results);
    }
  }

  return results;
};

const prefixedWith = (root, prefix) => {
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

  let pp = ""; // A prefix of the given prefix
  if (start < length) {
    const suffix = prefix.substring(start);
    const { length } = suffix;
    for (const key in node) {
      if (
        hasOwnProperty.call(node, key) &&
        key.substring(0, length) === suffix
      ) {
        pp = prefix.substring(0, prefix.length - suffix.length) + key;
        node = node[key];
        break;
      }
    }
  } else if (node !== root || hasOwnProperty.call(node, prefix)) {
    pp = prefix;
  }

  return start < length && pp === ""
    ? []
    : collect(node, pp, []).sort(([a], [b]) => (a < b ? -1 : 1));
};

Suite()
  .add("trie prefixed-with", () => prefixedWith(trie.root, "prepar"))
  .on("cycle", ({ target: { name, hz, stats } }) =>
    console.log(name, hz.toFixed(2), `±${stats.rme.toFixed(2)}`)
  )
  .run();
