const { readFileSync } = require("fs");
const { join } = require("path");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));

global.gc();
const heapUsedBefore = process.memoryUsage().heapUsed;

const map = new Map(JSON.parse(mapJSON));
const heapUsedAfterInit = process.memoryUsage().heapUsed;

global.gc();
const heapUsedAfterGC = process.memoryUsage().heapUsed;

console.log("map size", map.size);
console.log("map memory-peak", heapUsedAfterInit - heapUsedBefore);
console.log("map memory-stable", heapUsedAfterGC - heapUsedBefore);
