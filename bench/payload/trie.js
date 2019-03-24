const { readFileSync } = require("fs");
const { join } = require("path");
const { gzipSync, brotliCompressSync } = require("zlib");

const trieJSON = readFileSync(join(__dirname, "../data/trie.json"));
console.log("trie payload", trieJSON.length);

const gzippedTrieJSON = Buffer.from(gzipSync(trieJSON));
console.log("trie payload-gzip", gzippedTrieJSON.length);

const brotliedTrieJSON = Buffer.from(brotliCompressSync(trieJSON));
console.log("trie payload-br", brotliedTrieJSON.length);
