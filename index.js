const { keys } = Object;
const { hasOwnProperty } = Object.prototype;

// Does not consider the empty string a prefix of any string
const findKeyPrefixOf = (object, string) => {
  const { length } = string;
  let end = 1;
  while (end <= length) {
    const key = string.substring(0, end);
    if (hasOwnProperty.call(object, key)) {
      return key;
    }

    end += 1;
  }

  return undefined;
};

// Does not consider the empty string a prefix of a non-empty string
const findKeyWithCommonPrefix = (object, string) => {
  const char = string.charAt(0);
  for (const key in object) {
    if (hasOwnProperty.call(object, key) && key.charAt(0) === char) {
      return key;
    }
  }

  return undefined;
};

const findFirstKey = (object) => {
  let first;
  for (const key in object) {
    if (hasOwnProperty.call(object, key) && (!first || first > key)) {
      first = key;
    }
  }

  return first;
};

const findNextKey = (object, currentKey) => {
  let next;
  for (const key in object) {
    if (
      hasOwnProperty.call(object, key) &&
      key > currentKey &&
      (!next || next > key)
    ) {
      next = key;
    }
  }

  return next;
};

const findFirstBranch = (root) => {
  for (const key in root) {
    if (hasOwnProperty.call(root, key)) {
      return root;
    }
  }

  return undefined;
};

const findLastBranch = (root, string) => {
  let node = root;
  let suffix = string;
  let key = findKeyPrefixOf(node, suffix);
  while (key && suffix.length > 0) {
    node = node[key];
    suffix = suffix.substring(key.length);
    key = findKeyPrefixOf(node, suffix);
  }

  return suffix.length === 0 ? node : undefined;
};

// Mutates the `path` argument
const findNextBranch = (root, path) => {
  // Traverse the path storing the nodes along it
  path.pop();
  const { length } = path;
  const nodes = [];
  let key = "";
  let node = root;
  let step = 0;
  while (node && step < length) {
    nodes.push(node);
    node = node[path[step]];
    step += 1;
  }

  // If the path diverged, find the first branch after the diversion point
  if (!node) {
    let suffix = path.splice(step - 1).join("");
    node = nodes.pop();
    key = findKeyPrefixOf(node, suffix);
    while (key && suffix.length > 0) {
      path.push(key);
      nodes.push(node);
      node = node[key];
      suffix = suffix.substring(key.length);
      key = findKeyPrefixOf(node, suffix);
    }
  }

  // Find the next key
  key = findNextKey(node, key || "");
  while (!key) {
    if (path.length === 0) {
      return undefined;
    }

    node = nodes.pop();
    key = findNextKey(node, path.pop());
  }

  path.push(key);
  return node[key];
};

// Iterates over keys if `index` is 0, values if it is 1, or entries otherwise
const createIterator = (root, index) => {
  const path = [];
  let done = false;
  const iterator = {
    next() {
      if (done) {
        return { done, value: undefined };
      }

      // Find the next branch node
      const findBranch = path.length === 0 ? findFirstBranch : findNextBranch;
      let node = findBranch(root, path);
      if (!node) {
        done = true;
        return { done, value: undefined };
      }

      // Find the first branch node with a leaf in the current branch
      while (!hasOwnProperty.call(node, "")) {
        const key = findFirstKey(node);
        path.push(key);
        node = node[key];
      }

      path.push("");
      return {
        done,
        value:
          index === 0
            ? path.join("")
            : index === 1
            ? node[""]
            : [path.join(""), node[""]],
      };
    },
  };
  if (Symbol && Symbol.iterator) {
    iterator[Symbol.iterator] = () => iterator;
  }

  return iterator;
};

/**
 * Returns a trie object.
 *
 * It may be initialized from the given `elements`, which is an array or other
 * iterable whose elements are key-value pairs, or a root object. If `elements`
 * is a root object, it may be deeply mutated by the trie's methods.
 */
export default function (elements) {
  if (typeof elements !== "object" && typeof elements !== "undefined") {
    throw TypeError();
  }

  let root = {};
  let size = 0;
  let isSizeMemoized = true;
  const trie = {
    /**
     * Returns the root node, whose `""` key is the label of its value, and the
     * rest of its keys are the labels of its child nodes.
     */
    get root() {
      return root;
    },

    /**
     * Returns the number of key-value pairs.
     */
    get size() {
      if (!isSizeMemoized) {
        const { next } = createIterator(root, 1);
        isSizeMemoized = true;
        size = 0;
        while (!next().done) {
          size += 1;
        }
      }

      return size;
    },

    /**
     * Removes all key-value pairs.
     */
    clear() {
      size = 0;

      // Delete the keys of the root because suspended iterators reference it
      keys(root).forEach((key) => delete root[key]);
    },

    /**
     * Returns `true` if an element with the given `key` existed and has been
     * removed, or `false` if the element does not exist.
     */
    delete(key) {
      let grandparent;
      let parentKey;
      let parent;
      let nodeKey;
      let node = root;
      let suffix = String(key);
      let nextKey = findKeyPrefixOf(node, suffix);
      while (nextKey && suffix.length > 0) {
        grandparent = parent;
        parentKey = nodeKey;
        parent = node;
        nodeKey = nextKey;
        node = node[nextKey];
        suffix = suffix.substring(nodeKey.length);
        nextKey = findKeyPrefixOf(node, suffix);
      }

      if (suffix.length > 0 || !hasOwnProperty.call(node, "")) {
        return false;
      }

      size -= 1;
      delete node[""];
      if (parent) {
        const children = keys(node);
        if (children.length < 2) {
          delete parent[nodeKey];
          if (children.length === 1) {
            const [childKey] = children;
            parent[nodeKey + childKey] = node[childKey];
          } else if (grandparent) {
            const siblings = keys(parent);
            const [siblingKey] = siblings;
            if (siblings.length === 1 && siblingKey !== "") {
              grandparent[parentKey + siblingKey] = parent[siblingKey];
              delete grandparent[parentKey];
            }
          }
        }
      }

      return true;
    },

    /**
     * Returns a new `Iterator` object that contains an array of `[key, value]`
     * for each element in alphabetical order.
     */
    entries() {
      return createIterator(root);
    },

    /**
     * Calls the given `callbackfn` once for each key-value pair, in
     * alphabetical order, passing to the `callbackfn` the value of the item,
     * the key of the item, and the trie object being traversed. If `thisArg`
     * is given, it will be used as the `this` value for each callback.
     */
    forEach(callbackfn, thisArg) {
      const boundCallbackfn = callbackfn.bind(thisArg);
      const { next } = createIterator(root);
      let { done, value = [] } = next();
      while (!done) {
        boundCallbackfn(value[1], value[0], trie);
        ({ done, value = [] } = next());
      }
    },

    /**
     * Returns the value associated to the given `key`, or `undefined` if there
     * is none.
     */
    get(key) {
      const node = findLastBranch(root, String(key));
      return node ? node[""] : undefined;
    },

    /**
     * Returns `true` if a value has been associated to the given `key`, or
     * `false` otherwise.
     */
    has(key) {
      const node = findLastBranch(root, String(key));
      return node ? hasOwnProperty.call(node, "") : false;
    },

    /**
     * Returns a new `Iterator` object that contains the keys for each element
     * in alphabetical order.
     */
    keys() {
      return createIterator(root, 0);
    },

    /**
     * Returns the trie, associating the given `value` to the given `key`.
     */
    set(key, value) {
      let node = root;
      let suffix = String(key);
      let nextKey = findKeyPrefixOf(node, suffix);
      while (nextKey && suffix.length > 0) {
        node = node[nextKey];
        suffix = suffix.substring(nextKey.length);
        nextKey = findKeyPrefixOf(node, suffix);
      }

      if (suffix.length === 0) {
        node[""] = value;
        return trie;
      }

      size += 1;
      const keyToSplit = findKeyWithCommonPrefix(node, suffix);
      if (keyToSplit) {
        const { length } = keyToSplit;
        let pos = 1;
        while (pos < length && keyToSplit.charAt(pos) === suffix.charAt(pos)) {
          pos += 1;
        }

        node[keyToSplit.substring(0, pos)] = {
          [keyToSplit.substring(pos)]: node[keyToSplit],
          [suffix.substring(pos)]:
            pos === suffix.length ? value : { "": value },
        };
        delete node[keyToSplit];
      } else {
        node[suffix] = { "": value };
      }

      return trie;
    },

    /**
     * Returns a new `Iterator` object that contains the values for each
     * element in alphabetical order.
     */
    values() {
      return createIterator(root, 1);
    },
  };
  if (Symbol && Symbol.iterator) {
    /**
     * Returns a new `Iterator` object that contains an array of `[key, value]`
     * for each element in alphabetical order.
     */
    trie[Symbol.iterator] = () => createIterator(root);
  }

  // Initialize
  if (Array.isArray(elements)) {
    // Initialize from array
    const { set } = trie;
    Array.prototype.forEach.call(elements, (entry) => set(entry[0], entry[1]));
  } else if (elements != null && Symbol && Symbol.iterator in elements) {
    // Initialize from iterable
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
  } else if (elements != null) {
    // Initialize from object
    root = elements;
    isSizeMemoized = false;
  } else {
    root = {};
  }

  return trie;
}
