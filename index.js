const valueKey = "";
const sizeKey = "size";

const { hasOwnProperty } = Object.prototype;
const { keys } = Object;

const sortedKeys = object => keys(object).sort();

const createIterator = (root, iteratorValueCreator, path = [[null, root]]) => {
  let done = false;
  const iterator = {
    next() {
      if (done) {
        return { done, value: undefined };
      }

      let [lastCharacter, node] = path.pop();
      if (lastCharacter == null) {
        if (hasOwnProperty.call(node, valueKey)) {
          path.push(["", node]);
          return { done, value: iteratorValueCreator(path, node) };
        }

        lastCharacter = "";
      }

      const isNextCharacter = key => lastCharacter < key && key.length === 1;
      let character = sortedKeys(node).find(isNextCharacter);
      while (character == null) {
        if (path.length === 0) {
          done = true;
          return { done, value: undefined };
        }

        [lastCharacter, node] = path.pop();
        character = sortedKeys(node).find(isNextCharacter);
      }

      let foundValue = false;
      while (character != null && !foundValue) {
        path.push([character, node]);
        node = node[character];
        character = sortedKeys(node).find(key => key.length === 1);
        foundValue = hasOwnProperty.call(node, valueKey);
      }

      path.push(["", node]);
      return { done, value: iteratorValueCreator(path, node) };
    }
  };
  if (Symbol && Symbol.iterator) {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }

  return iterator;
};

// Iterator value creators
const key = path => path.reduce((key, [character]) => key + character, "");
const value = (path, node) => node[valueKey];
const entry = (path, node) => [key(path), value(path, node)];

const getNode = (root, key) => {
  const { length } = key;
  let node = root;
  let index = 0;
  while (node != null && index < length) {
    node = node[key.charAt(index)];
    index += 1;
  }

  return node;
};

/**
 * Returns a trie object, which is iterable. Can be initialized from the given
 * `elements`, which is an array or other iterable whose elements are
 * key-value pairs, or a trie's root object. If initialized from a trie's root
 * object, the argument may be deeply mutated by the trie's methods.
 */
export default function(elements) {
  if (typeof elements !== "undefined" && typeof elements !== "object") {
    throw TypeError();
  }

  let root = null;
  const trie = {
    /**
     * Returns the trie's root object, where values have the key `""`, the size
     * of the trie has the key `size` at the root object, and the characters of
     * a key are at a depth equal to their index in the key.
     */
    get root() {
      return root;
    },

    /**
     * Returns the number of key-value pairs.
     */
    get size() {
      return root[sizeKey];
    },

    /**
     * Removes all key-value pairs
     */
    clear() {
      root = { [sizeKey]: 0 };
    },

    /**
     * Returns `true` if an element with the given `key` existed and has been
     * removed, or `false` if the element does not exist.
     */
    delete(key = "") {
      const { length } = key;
      let node = root;
      let ancestor = root;
      let ancestorChar = key.charAt(0);
      let index = 0;
      while (node != null && index < length) {
        const currentChar = key.charAt(index);
        if (keys(node).length > 1) {
          ancestor = node;
          ancestorChar = currentChar;
        }

        node = node[currentChar];
        index += 1;
      }

      if (node == null || !hasOwnProperty.call(node, valueKey)) {
        return false;
      }

      root[sizeKey] -= 1;
      if (keys(node).length <= 1) {
        return delete ancestor[ancestorChar];
      }

      return delete node[valueKey];
    },

    /**
     * Returns a new `Iterator` object that contains an array of `[key, value]`
     * for each element in alphabetical order.
     */
    entries() {
      return createIterator(root, entry);
    },

    /**
     * Calls the given `callbackfn` once for each key-value pair, in
     * alphabetical order, passing to the `callbackfn` the value of the item,
     * the key of the item, and the trie object being traversed. If `thisArg`
     * is given, it will be used as the `this` value for each callback.
     */
    forEach(callbackfn, thisArg) {
      const boundCallbackfn = callbackfn.bind(thisArg);
      const { next } = createIterator(root, entry);
      let { done, value: [key, value] = [] } = next();
      while (!done) {
        boundCallbackfn(value, key, trie);
        ({ done, value: [key, value] = [] } = next());
      }
    },

    /**
     * Returns the value associated to the given `key`, or `undefined` if there
     * is none.
     */
    get(key = "") {
      const node = getNode(root, key);
      return node == null ? undefined : node[valueKey];
    },

    /**
     * Returns an array that contains an array of `[key, value]` for each key
     * that is a prefix of the given `string`, in alphabetical order.
     */
    getPrefixesOf(string = "") {
      const { length } = string;
      const prefixes = [];
      let node = root;
      let index = 0;
      while (node != null && index <= length) {
        if (hasOwnProperty.call(node, valueKey)) {
          prefixes.push([string.slice(0, index), node[valueKey]]);
        }

        node = node[string.charAt(index)];
        index += 1;
      }

      return prefixes;
    },

    /**
     * Returns an array that contains an array of `[key, value]` for each key
     * prefixed with the given `prefix`, in alphabetical order.
     */
    getPrefixedWith(prefix = "") {
      const node = getNode(root, prefix);
      if (node == null) {
        return [];
      }

      const prefixedWith = [];
      const { next } = createIterator(root, entry, [[null, node]]);
      let { done, value: [suffix, value] = [] } = next();
      while (!done) {
        prefixedWith.push([prefix + suffix, value]);
        ({ done, value: [suffix, value] = [] } = next());
      }

      return prefixedWith;
    },

    /**
     * Returns `true` if a value has been associated to the given `key`, or
     * `false` otherwise.
     */
    has(key = "") {
      const node = getNode(root, key);
      return node != null && hasOwnProperty.call(node, valueKey);
    },

    /**
     * Returns a new `Iterator` object that contains the keys for each element
     * in alphabetical order.
     */
    keys() {
      return createIterator(root, key);
    },

    /**
     * Returns the trie, associating the given `value` to the given `key`.
     */
    set(key = "", value) {
      const { length } = key;
      let node = root;
      let parent = node;
      let index = 0;
      while (index < length) {
        node = node[key.charAt(index)];
        if (node == null) {
          node = {};
          parent[key.charAt(index)] = node;
        }

        parent = node;
        index += 1;
      }

      if (!hasOwnProperty.call(node, valueKey)) {
        root[sizeKey] += 1;
      }

      node[valueKey] = value;
      return trie;
    },

    /**
     * Returns a new `Iterator` object that contains the values for each
     * element in alphabetical order.
     */
    values() {
      return createIterator(root, value);
    }
  };
  if (Symbol && Symbol.iterator) {
    /**
     * Returns a new `Iterator` object that contains an array of `[key, value]`
     * for each element in alphabetical order.
     */
    trie[Symbol.iterator] = function() {
      return createIterator(root, entry);
    };
  }

  // Initialize from argument
  if (Array.isArray(elements)) {
    // Initialize from array
    root = { [sizeKey]: 0 };
    const { set } = trie;
    Array.prototype.forEach.call(elements, entry => set(entry[0], entry[1]));
  } else if (elements != null && Symbol && Symbol.iterator in elements) {
    // Initialize from iterable
    root = { [sizeKey]: 0 };
    const { set } = trie;
    const iterator = elements[Symbol.iterator]();
    let { done, value } = iterator.next();
    while (!done) {
      if (typeof value !== "object") {
        throw TypeError();
      }

      set(value[0], value[1]);
      ({ done, value } = iterator.next());
    }
  } else {
    // Initialize from object
    root = elements || {};
    root[sizeKey] = root[sizeKey] || 0;
  }

  return trie;
}
