const { readFileSync } = require("fs");
const { join } = require("path");
const trieMapping = require("../../dist/index.js");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));

global.gc();
const heapUsedBefore = process.memoryUsage().heapUsed;

const trie = trieMapping(JSON.parse(trieJSON));
const heapUsedAfterInit = process.memoryUsage().heapUsed;

global.gc();
const heapUsedAfterGC = process.memoryUsage().heapUsed;

console.log("trie size", trie.size);
console.log("trie memory-peak", heapUsedAfterInit - heapUsedBefore);
console.log("trie memory-stable", heapUsedAfterGC - heapUsedBefore);
