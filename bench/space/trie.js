import { readFileSync } from "fs";
import trieMapping from "../../index.js";

const data = readFileSync(new URL("../data/trie.json", import.meta.url));

global.gc();
const heapUsedBefore = process.memoryUsage().heapUsed;

const trie = trieMapping(JSON.parse(data));
const heapUsedAfterInit = process.memoryUsage().heapUsed;

global.gc();
const heapUsedAfterGC = process.memoryUsage().heapUsed;

console.log("trie size", trie.size);
console.log("trie memory-peak", heapUsedAfterInit - heapUsedBefore);
console.log("trie memory-stable", heapUsedAfterGC - heapUsedBefore);
