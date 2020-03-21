# trie-mapping

[![npm version](https://img.shields.io/npm/v/trie-mapping.svg?style=flat-square)](https://www.npmjs.com/package/trie-mapping)
[![Build Status](https://travis-ci.com/rtomrud/trie-mapping.svg?branch=master)](https://travis-ci.com/rtomrud/trie-mapping)
[![Coverage Status](https://coveralls.io/repos/github/rtomrud/trie-mapping/badge.svg?branch=master)](https://coveralls.io/github/rtomrud/trie-mapping?branch=master)
[![Code size](https://badgen.net/bundlephobia/minzip/trie-mapping)](https://bundlephobia.com/result?p=trie-mapping)

A [compact trie](https://en.wikipedia.org/wiki/Radix_tree) for mapping keys to values with efficient prefix-based retrievals

- Mimics the API of the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), but with iteration in alphabetical order instead of in insertion order
- Allows efficient retrieval of prefixes and suffixes from the compact trie returned by the [`root`](#root) getter
- Compact payload and efficient serialization and deserialization with the [`root`](#root) getter
- Lightweight (1.5 kB minified and gzipped), no dependencies, and [ES5 compatible](#ecmascript-compatibility)

## Installing

```bash
npm install trie-mapping
```

## API

The API mimics that of the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), with the following differences:

- The `key` argument of [`get()`](#getkey), [`delete()`](#deletekey), [`has()`](#haskey), and [`set()`](#setkey-value) must be a string
- The iteration order of [`entries()`](#entries), [`forEach()`](#foreachcallbackfn-thisarg), [`keys()`](#keys), [`values()`](#values), and [`[@@iterator]()`](#iterator) is alphabetical, instead of insertion order
- It exports a [factory function](#triemappingelements), which can be initialized from any iterable or a trie's [`root`](#root) object

The [`size`](#size) getter and the [`clear()`](#clear) method are identical to those of the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

_Note that when a given argument that must be a string is not, it is converted with [`String()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)._

### `trieMapping(elements)`

Returns a trie object, which is [iterable].

It can be initialized from the given `elements`, which is an array or other iterable whose elements are key-value pairs, or a root object. If `elements` is a root object, it may be deeply mutated by the trie's methods.

The iteration order of [`keys()`](#keys), [`values()`](#values), [`entries()`](#entries), and [`[@@iterator]()`](#iterator) is alphabetical (by character Unicode code point value).

```js
import trieMapping from "trie-mapping";

// Create an empty trie
trieMapping();

// Initialize from an array
trieMapping([["hey", 0], ["hi", 1]]);

// Initialize from an iterable
trieMapping(new Map([["hey", 0], ["hi", 1]]));

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

This getter exposes the inner state of the trie, so that some advanced use cases are possible, such as:

- Serializing a trie as JSON in a more compact way, and quickly, than with [`entries()`](#entries)
- Efficiently initializing a new trie by passing a trie's root node to the [`trieMapping()`](#triemappingelements) factory function
- Creating a new trie from a subtree of another trie
- Composing a new trie by merging other tries

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

## ECMAScript compatibility

This module supports every mantained version of Node, every modern browser, and IE 11 (requires transpilation).

It can be transpiled to ES5 without the need for polyfills, since it does not rely on [`Symbol.iterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator). For example, when transpiling with [Babel](https://babeljs.io/docs/en/caveats), you do not need to include the `Symbol` and `prototype[Symbol.iterator]` polyfills.

## License

[MIT](./LICENSE)

[iterable]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables
[`iterator`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterators
