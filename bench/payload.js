import { Buffer } from "node:buffer";
import console from "node:console";
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import { gzipSync, brotliCompressSync } from "node:zlib";

const mapData = readFileSync(new URL("./map.json", import.meta.url));
console.log("map payload", mapData.length);

const gzippedMapData = Buffer.from(gzipSync(mapData));
console.log("map payload-gzip", gzippedMapData.length);

const brotliedMapData = Buffer.from(brotliCompressSync(mapData));
console.log("map payload-br", brotliedMapData.length);

const trieData = readFileSync(new URL("./trie.json", import.meta.url));
console.log("trie payload", trieData.length);

const gzippedTrieData = Buffer.from(gzipSync(trieData));
console.log("trie payload-gzip", gzippedTrieData.length);

const brotliedTrieData = Buffer.from(brotliCompressSync(trieData));
console.log("trie payload-br", brotliedTrieData.length);
