const { readFileSync } = require("fs");
const { join } = require("path");
const { gzipSync, brotliCompressSync } = require("zlib");

const mapJSON = readFileSync(join(__dirname, "../data/map.json"));
console.log("map payload", mapJSON.length);

const gzippedMapJSON = Buffer.from(gzipSync(mapJSON));
console.log("map payload-gzip", gzippedMapJSON.length);

const brotliedMapJSON = Buffer.from(brotliCompressSync(mapJSON));
console.log("map payload-br", brotliedMapJSON.length);
