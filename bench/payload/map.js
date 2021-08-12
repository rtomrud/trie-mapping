import { readFileSync } from "fs";
import { gzipSync, brotliCompressSync } from "zlib";

const data = readFileSync(new URL("../data/map.json", import.meta.url));
console.log("map payload", data.length);

const gzippedData = Buffer.from(gzipSync(data));
console.log("map payload-gzip", gzippedData.length);

const brotliedData = Buffer.from(brotliCompressSync(data));
console.log("map payload-br", brotliedData.length);
