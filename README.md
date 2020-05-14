# trie-mapping

[![build status](https://github.com/rtomrud/trie-mapping/workflows/build/badge.svg)](https://github.com/rtomrud/trie-mapping/actions?query=branch%3Amaster+workflow%3Abuild)
[![npm version](https://badgen.net/npm/v/trie-mapping)](https://www.npmjs.com/package/trie-mapping)
[![bundle size](https://badgen.net/bundlephobia/minzip/trie-mapping)](https://bundlephobia.com/result?p=trie-mapping)

A [compact trie](https://en.wikipedia.org/wiki/Radix_tree) for mapping keys to values that allows efficient prefix-based retrievals

## Installing

```bash
npm install trie-mapping
```

## API

The API mimics the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) (so it may be used as a drop in replacement), with the following differences:

- It exports a factory function ([`trieMapping()`](#triemappingelements)) which may be initialized from a trie's [`root`](#root) object
- It exposes the trie's internal representation through the [`root`](#root) getter to enable advanced use cases
- The `key` argument of [`get()`](#getkey), [`delete()`](#deletekey), [`has()`](#haskey), and [`set()`](#setkey-value) must be a string
- The iteration order of [`entries()`](#entries), [`forEach()`](#foreachcallbackfn-thisarg), [`keys()`](#keys), [`values()`](#values), and [`[@@iterator]()`](#iterator) is alphabetical

_The [`size`](#size) getter and the [`clear()`](#clear) method are identical to those of the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)_.

### `trieMapping(elements)`

Returns a trie object.

It may be initialized from the given `elements`, which is an array or other iterable whose elements are key-value pairs, or a root object. If `elements` is a root object, it may be deeply mutated by the trie's methods.

```js
import trieMapping from "trie-mapping";

// Create an empty trie
trieMapping();

// Initialize from an array
trieMapping([
  ["hey", 0],
  ["hi", 1]
]);

// Initialize from a trie's root object, e.g., what the `root` getter returns
trieMapping({
  h: {
    ey: { "": 0 },
    i: { "": 1 }
  }
});
```

### `root`

Returns the root node, whose `""` key is the label of its value, and the rest of its keys are the labels of its child nodes.

```js
import trieMapping from "trie-mapping";

trieMapping([
  ["he", 1],
  ["hey", 5],
  ["hells", 4],
  ["hello", 3],
  ["hell", 2],
  ["bye", 0]
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

It exposes the inner state of the trie for use cases such as:

- Finding all entries prefixed with a given prefix ([see example](./bench/time/trie-prefixed-with.js))
- Implementing fuzzy string searching, e.g., with [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
- Serializing a trie as JSON more compactly and quickly than with [`entries()`](#entries)
- Efficiently initializing a new trie by passing a trie node to the [`trieMapping()`](#triemappingelements) factory function

### `size`

Returns the number of key-value pairs.

_Note that if the trie was initialized from a [root](#root) object, getting the `size` for the first time requires traversing the trie to count the number of elements. Afterwards, the size is memoized, even if you [`delete()`](#deletekey) or [`set()`](#setkey-value) elements._

### `clear()`

Removes all key-value pairs.

### `delete(key)`

Returns `true` if an element with the given `key` existed and has been removed, or `false` if the element does not exist.

### `entries()`

Returns a new [`Iterator`] object that contains an array of `[key, value]` for each element in alphabetical order.

### `forEach(callbackfn, thisArg)`

Calls the given `callbackfn` once for each key-value pair, in alphabetical order, passing to the `callbackfn` the value of the item, the key of the item, and the trie object being traversed. If `thisArg` is given, it will be used as the `this` value for each callback.

### `get(key)`

Returns the value associated to the given `key`, or `undefined` if there is none.

### `has(key)`

Returns `true` if a value has been associated to the given `key`, or `false` otherwise.

### `keys()`

Returns a new [`Iterator`] object that contains the keys for each element in alphabetical order.

### `set(key, value)`

Returns the trie, associating the given `value` to the given `key`.

### `values()`

Returns a new [`Iterator`] object that contains the values for each element in alphabetical order.

### `[@@iterator]()`

Returns a new [`Iterator`] object that contains an array of `[key, value]` for each element in alphabetical order.

## License

[MIT](./LICENSE)

[`iterator`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterators
