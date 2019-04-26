# trie-mapping

[![npm version](https://img.shields.io/npm/v/trie-mapping.svg?style=flat-square)](https://www.npmjs.com/package/trie-mapping)
[![Build Status](https://travis-ci.com/rtomrud/trie-mapping.svg?branch=master)](https://travis-ci.com/rtomrud/trie-mapping)
[![Coverage Status](https://coveralls.io/repos/github/rtomrud/trie-mapping/badge.svg?branch=master)](https://coveralls.io/github/rtomrud/trie-mapping?branch=master)

A [compact trie](https://en.wikipedia.org/wiki/Radix_tree) for mapping keys to values with efficient prefix-based retrievals

- Mimics the API of the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), but with iteration in alphabetical order instead of in insertion order
- Retrieve prefixes and suffixes with [`branchOfFirstPrefix()`](#branchoffirstprefixstring), [`branchOfLastPrefix()`](#branchoflastprefixstring), and [`branchPrefixedWith()`](#branchprefixedwithprefix)
- Compact payload and efficient serialization and deserialization with the [`root`](#root) getter
- Lightweight (1.5 kB minified and gzipped), no dependencies, and [ES5 compatible](#ecmascript-compatibility)

## Installing

```bash
npm install trie-mapping
```

## API

The API mimics that of the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), with the following differences:

- The `key` argument of [`get()`](#getkey), [`delete()`](#deletekey), [`has()`](#haskey), and [`set()`](#setkey-value) must be a string
- The iteration order of [`entries()`](#entries), [`forEach()`](#foreachcallbackfn-thisarg), [`keys()`](#keys), [`values()`](#values), and [`[@@iterator]()`](#iterator) is alphabetical
- It has the methods [`branchOfFirstPrefix()`](#branchoffirstprefixstring), [`branchOfLastPrefix()`](#branchoflastprefixstring), and [`branchPrefixedWith()`](#branchprefixedwithprefix)
- It exports a [factory function](#triemappingelements-compare), which can be initialized from any iterable or a trie's [`root`](#root) object

The [`size`](#size) getter and the [`clear()`](#clear) method are identical to those of the native [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

_Note that when a given argument that must be a string is not, it is converted with [`String()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)._

### `trieMapping(elements, compare)`

Returns a trie object, which is [iterable].

It can be initialized from the given `elements`, which is an array or other iterable whose elements are key-value pairs, or a root object. If `elements` is a root object, it may be deeply mutated by the trie's methods.

The iteration order of [`keys()`](#keys), [`values()`](#values), [`entries()`](#entries), and [`[@@iterator]()`](#iterator) can be customized by passing a `compare` function as the second argument, which must return a positive number if its first argument is lower than the second one, or a negative number if it is higher. By default the iteration order is by each character's Unicode code point value.

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

```js
import trieMapping from "trie-mapping";

// Initialize with a compare function for locale sensitive iteration order
[
  ...trieMapping(
    [["resume", 0], ["rosé", 2], ["résumé", 1]],
    Intl.Collator("en").compare
  )
];
// => [["resume", 0], ["résumé", 1], ["rosé", 2]]
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
- Efficiently initializing a new trie by passing a trie's root node to the [`trieMapping()`](#triemappingelements-compare) factory function
- Creating a new trie from a subtree of another trie
- Composing a new trie by merging other tries

### `size`

Returns the number of key-value pairs.

_Note that if the trie was initialized from a [root](#root) object, getting the `size` for the first time requires traversing the trie to count the number of elements. Afterwards, the size is memoized, even if you [`delete()`](#deletekey) or [`set()`](#setkey-value) elements._

### `branchOfFirstPrefix(string)`

Returns the first prefix of the given `string` and its branch node as `[prefix, branch]`, or `[]` if there is none.

```js
import trieMapping from "trie-mapping";

const trie = trieMapping([["h", 0], ["he", 1], ["hello", 2], ["hey", 3]]);

trie.branchOfFirstPrefix("hellos");
// => ["h", { "": 0, "e": { "": 1, "llo": { "": 2 }, "y": { "": 3 } } }]

// Get the key of the first prefix of the given string
trie.branchOfFirstPrefix("hellos")[0];
// => "h"

// Get the value of the first prefix of the given string
trie.branchOfFirstPrefix("hellos")[1][""];
// => 0

// Get all entries prefixed with the first prefix of the given string
const [prefix, branch] = trie.branchOfFirstPrefix("hel");
Array.from(trieMapping(branch).entries(), ([key, val]) => [prefix + key, val]);
// => [["h", 0], ["he", 1], ["hello", 2], ["hey", 3]]
```

### `branchOfLastPrefix(string)`

Returns the last prefix of the given `string` and its branch node as `[prefix, branch]`, or `[]` if there is none.

```js
import trieMapping from "trie-mapping";

const trie = trieMapping([["h", 0], ["he", 1], ["hello", 2], ["hey", 3]]);

trie.branchOfLastPrefix("hellos");
// => ["hello", { "": 2 }]

// Get the key of the last prefix of the given string
trie.branchOfLastPrefix("hellos")[0];
// => "hello"

// Get the value of the last prefix of the given string
trie.branchOfLastPrefix("hellos")[1][""];
// => 2

// Get all entries prefixed with the last prefix of the given string
const [prefix, branch] = trie.branchOfLastPrefix("hel");
Array.from(trieMapping(branch).entries(), ([key, val]) => [prefix + key, val]);
// => [["he", 1], ["hello", 2], ["hey", 3]]
```

### `branchPrefixedWith(prefix)`

Returns the string of the branch prefixed with the given `prefix` and its branch node as `[string, branch]`, or `[]` if there is none.

_Note that if the given `prefix` is not in the trie, yet there are keys prefixed with it, the returned `string` will not equal `prefix`._

```js
import trieMapping from "trie-mapping";

const trie = trieMapping([["h", 0], ["he", 1], ["hello", 2], ["hey", 3]]);

trie.branchPrefixedWith("hel");
// => ["hello", { "": 2 }]

// Get the first key prefixed with the given string
trie.branchPrefixedWith("hel")[0];
// => "hello"

// Get the value of the first key prefixed with the given string
trie.branchPrefixedWith("hel")[1][""];
// => 2

// Get all entries prefixed with the given string
const [string, branch] = trie.branchPrefixedWith("he");
Array.from(trieMapping(branch).entries(), ([key, val]) => [string + key, val]);
// => [["he", 1], ["hello", 2], ["hey", 3]]
```

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
