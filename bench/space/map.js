import { readFileSync } from "fs";

const data = readFileSync(new URL("../data/map.json", import.meta.url));

global.gc();
const heapUsedBefore = process.memoryUsage().heapUsed;

const map = new Map(JSON.parse(data));
const heapUsedAfterInit = process.memoryUsage().heapUsed;

global.gc();
const heapUsedAfterGC = process.memoryUsage().heapUsed;

console.log("map size", map.size);
console.log("map memory-peak", heapUsedAfterInit - heapUsedBefore);
console.log("map memory-stable", heapUsedAfterGC - heapUsedBefore);
