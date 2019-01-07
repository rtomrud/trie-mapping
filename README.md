# trie-mapping

[![npm version](https://img.shields.io/npm/v/trie-mapping.svg?style=flat-square)](https://www.npmjs.com/package/trie-mapping)
[![Build Status](https://travis-ci.com/rtomrud/trie-mapping.svg?branch=master)](https://travis-ci.com/rtomrud/trie-mapping)

A [trie](https://en.wikipedia.org/wiki/Trie) to store key-value pairs with efficient prefix-based retrievals

- Mimics API of [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) very closely, but with iteration in alphabetical order instead of in insertion order
- Methods [`getPrefixesOf()`](#getprefixesofstring) and [`getPrefixedWith()`](#getprefixedwithprefix), which allow efficient prefix-based retrievals
- A [`root`](#root) getter that returns the trie's root, which allows efficient serialization and deserialization
- Fast, lightweight (1 KB minified and gzipped), no dependencies, and [ES5 compatible](#ecmascript-compatibility)

## Installing

```bash
npm install trie-mapping
```

## API

The API mimics that of the native `Map`, where [`size`](#size) and [`clear()`](#clear) are identical, and the differences are:

- The `key` argument of [`get()`](#getkey), [`delete()`](#deletekey), [`has()`](#haskey), and [`set()`](#setkey-value) must be a string
- The traversal order of [`entries()`](#entries), [`forEach()`](#foreachcallbackfn-thisarg), [`keys()`](#keys), [`values()`](#values), and [`[@@iterator]()`](#iterator) is alphabetical
- It has the methods [`getPrefixesOf()`](#getprefixesofstring) and [`getPrefixedWith()`](#getprefixedwithprefix) for efficient prefix-based retrievals
- It exports a [factory function](#triemapelements), which can be initialized from any iterable or a trie's [`root`](#root) object

### `trieMapping(elements)`

Returns a trie object. Can be initialized from the given `elements`, which is an array or other iterable whose elements are key-value pairs, or a trie's root object. If initialized from a trie's root object, the argument may be deeply mutated by the trie's methods.

```js
import trieMapping from "trie-mapping";

// Create an empty trie
trieMapping();

// Initialize from an array
trieMapping([["hi", 0], ["hey", 1]]);

// Initialize from an iterable
trieMapping(new Map([["hi", 0], ["hey", 1]]));

// Initialize from a trie's root object, like the one returned by `root`
trieMapping({
  size: 2,
  h: {
    i: { "": 0 },
    e: {
      y: { "": 1 }
    }
  }
});
```

### `root`

Returns the trie's root object, where values have the key `""`, the size of the trie has the key `size` at the root object, and the characters of a key are at a depth equal to their index in the key.

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
{
  size: 6,
  h: {
    e: {
      "": 1,
      y: { "": 5 },
      l: {
        l: {
          s: { "": 4 },
          o: { "": 3 },
          "": 2
        }
      }
    }
  },
  b: {
    y: {
      e: { "": 0 }
    }
  }
}
```

This getter exposes the inner state of the trie, so that some advanced use cases are possible, such as:

- Serializing a trie as JSON in a more compact way, and quickly, than with [`entries()`](#entries)
- Efficiently creating a new trie by passing to [`trieMapping()`](#triemapelements) a trie's root object
- Creating a new trie from a subtree of another trie
- Composing a new trie by merging other tries

### `size`

Returns the number of key-value pairs.

### `clear()`

Removes all key-value pairs.

### `delete(key)`

Returns `true` if an element with the given `key` existed and has been removed, or `false` if the element does not exist.

### `entries()`

Returns a new `Iterator` object that contains an array of `[key, value]` for each element in alphabetical order.

### `forEach(callbackfn, thisArg)`

Calls the given `callbackfn` once for each key-value pair, in alphabetical order, passing to the `callbackfn` the value of the item, the key of the item, and the trie object being traversed. If `thisArg` is given, it will be used as the `this` value for each callback.

### `get(key)`

Returns the value associated to the given `key`, or `undefined` if there is none.

### `getPrefixesOf(string)`

Returns an array that contains an array of `[key, value]` for each key that is a prefix of the given `string`, in alphabetical order.

```js
import trieMapping from "trie-mapping";

 trieMapping([
  ["he", 1],
  ["hey", 5],
  ["hells", 4],
  ["hello", 3],
  ["hell", 2],
  ["bye", 0]
]).getPrefixesOf("hello");
// =>
[["he", 1], ["hell", 2], ["hello", 3]]
```

### `getPrefixedWith(prefix)`

Returns an array that contains an array of `[key, value]` for each key prefixed with the given `prefix`, in alphabetical order.

```js
import trieMapping from "trie-mapping";

trieMapping([
  ["he", 1],
  ["hey", 5],
  ["hells", 4],
  ["hello", 3],
  ["hell", 2],
  ["bye", 0]
]).getPrefixedWith("hell");
// =>
[["hell", 2], ["hello", 3], ["hells", 4]]
```

### `has(key)`

Returns `true` if a value has been associated to the given `key`, or `false` otherwise.

### `keys()`

Returns a new `Iterator` object that contains the keys for each element in alphabetical order.

### `set(key, value)`

Returns the trie, associating the given `value` to the given `key`.

### `values()`

Returns a new `Iterator` object that contains the values for each element in alphabetical order.

### `[@@iterator]()`

Returns a new `Iterator` object that contains an array of `[key, value]` for each element in alphabetical order.

## ECMAScript compatibility

This module is ES5 compatible without the need for polyfills.

It supports every mantained version of Node, every modern browser, and IE 11.

### Caveats

If ES6's `Symbol.iterator` is not available in the environment and is not polyfilled, features that depend on it will not work.

For example, spreading an iterable would throw in IE 11:

```js
import trieMapping from "trie-mapping";

// Throws if Symbol.iterator is missing
const entries = [...trieMapping([["a", 1], ["b", 2]]).entries()];
```

Yet the iterator is provided, so it can be used directly by calling `next()` on it:

```js
import trieMapping from "trie-mapping";

trieMapping([["a", 1], ["b", 2]]).entries().next();
// =>
{ done: false, value: ["a", 1] }
```

## License

[MIT](./LICENSE)
