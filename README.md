# trie-mapping

A [compact trie](https://en.wikipedia.org/wiki/Radix_tree) for mapping keys to values

## Installing

```bash
npm install trie-mapping
```

## API

The API is map-like, that is, it mimics the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), with the following differences:

- It exports a factory function ([`trieMapping()`](#triemappingiterable)) instead of a constructor, which may be initialized from a trie node object
- It exposes the root trie node through the [`root`](#root) getter, so that it can be traversed directly (for example, for prefix-based searches) or serialized
- The keys of the trie must be strings
- Iteration is done in alphabetical order instead of in insertion order

### `trieMapping(iterable)`

Creates a new `Trie` object.

```js
import trieMapping from "trie-mapping";

// Create an empty trie
trieMapping();

// Initialize from an array
trieMapping([
  ["hey", 0],
  ["hi", 1],
]);

// Initialize from a trie node object
trieMapping({
  h: {
    ey: { "": 0 },
    i: { "": 1 },
  },
});
```

### `root`

The root `TrieNode` object of the `Trie` object.

```js
import trieMapping from "trie-mapping";

trieMapping([
  ["he", 1],
  ["hey", 5],
  ["hells", 4],
  ["hello", 3],
  ["hell", 2],
  ["bye", 0],
]).root;
// =>
// {
//   he: {
//     "": 1,
//     y: { "": 5 },
//     ll: {
//       s: { "": 4 },
//       o: { "": 3 },
//       "": 2
//     }
//   },
//   bye: { "": 0 }
// }
```

### `size`

Returns the number of key-value pairs in the `Trie` object.

### `clear()`

Removes all key-value pairs from the `Trie` object.

### `delete(key)`

Returns `true` if an element in the `Trie` object existed and has been removed, or `false` if the element does not exist. `trie.has(key)` will return `false` afterwards.

### `entries()`

Returns a new Iterator object that contains a two-member array of `[key, value]` for each element in the `Trie` object in alphabetical order.

### `forEach(callbackfn, thisArg)`

Calls `callbackFn` once for each key-value pair present in the `Trie` object, in alphabetical order. If a `thisArg` parameter is provided to `forEach`, it will be used as the `this` value for each callback.

### `get(key)`

Returns the value associated to the passed key, or `undefined` if there is none.

### `has(key)`

Returns a boolean indicating whether a value has been associated with the passed key in the `Trie` object or not.

### `keys()`

Returns a new Iterator object that contains the keys for each element in the `Trie` object in alphabetical order.

### `set(key, value)`

Sets the value for the passed key in the `Trie` object. Returns the `Trie` object.

### `values()`

Returns a new Iterator object that contains the values for each element in the `Trie` object in alphabetical order.

### `[Symbol.iterator]()`

Returns a new Iterator object that contains a two-member array of `[key, value]` for each element in the `Trie` object in alphabetical order.
