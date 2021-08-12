import { readFileSync } from "fs";
import { gzipSync, brotliCompressSync } from "zlib";

const data = readFileSync(new URL("../data/trie.json", import.meta.url));
console.log("trie payload", data.length);

const gzippedData = Buffer.from(gzipSync(data));
console.log("trie payload-gzip", gzippedData.length);

const brotliedData = Buffer.from(brotliCompressSync(data));
console.log("trie payload-br", brotliedData.length);
