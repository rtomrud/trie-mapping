export interface TrieNode<T> {
  /**
   * The value associated to the node.
   */
  ""?: T;

  [key: string]: TrieNode<T> | T | undefined;
}

export interface Trie<T> {
  /**
   * The root `TrieNode` object of the `Trie` object.
   */
  readonly root: TrieNode<T>;

  /**
   * Returns the number of key-value pairs in the `Trie` object.
   */
  readonly size: number;

  /**
   * Removes all key-value pairs from the `Trie` object.
   */
  clear(): void;

  /**
   * Returns `true` if an element in the `Trie` object existed and has been
   * removed, or `false` if the element does not exist. `trie.has(key)` will
   * return `false` afterwards.
   *
   * @param key The key of the element to remove from the `Trie` object.
   * @returns `true` if an element in the `Trie` object existed and has been
   * removed, or `false` if the element does not exist.
   */
  delete(key: string): boolean;

  /**
   * Returns a new Iterator object that contains a two-member array of
   * `[key, value]` for each element in the `Trie` object in alphabetical order.
   *
   * @returns A new Iterable Iterator object.
   */
  entries(): IterableIterator<[string, T]>;

  /**
   * Calls `callbackFn` once for each key-value pair present in the `Trie`
   * object, in alphabetical order. If a `thisArg` parameter is provided to
   * `forEach`, it will be used as the `this` value for each callback.
   *
   * @param callbackFn A function to execute for each entry in the map.
   * @param [thisArg] A value to use as `this` when executing `callbackFn`.
   */
  forEach(callbackfn: (value: T, key: string, trie: Trie<T>) => void, thisArg?: unknown): void;

  /**
   * Returns the value associated to the passed key, or `undefined` if there is
   * none.
   *
   * @param key The key of the element to return from the `Trie` object.
   * @returns The element associated with the specified key, or undefined if the
   * key can't be found in the `Trie` object.
   */
  get(key: string): T | undefined;

  /**
   * Returns a boolean indicating whether a value has been associated with the
   * passed key in the `Trie` object or not.
   *
   * @param key The key of the element to test for presence in the `Trie` object.
   * @returns `true` if an element with the specified key exists in the `Trie`
   * object; otherwise `false`.
   */
  has(key: string): boolean;

  /**
   * Returns a new Iterator object that contains the keys for each element in the
   * `Trie` object in alphabetical order.
   *
   * @returns A new Iterable Iterator object.
   */
  keys(): IterableIterator<string>;

  /**
   * Sets the value for the passed key in the `Trie` object. Returns the `Trie`
   * object.
   *
   * @param key The key of the element to add to the `Trie` object.
   * @param value The value of the element to add to the `Trie` object.
   * @returns The `Trie` object.
   */
  set(key: string, value: T): this;

  /**
   * Returns a new Iterator object that contains the values for each element in
   * the `Trie` object in alphabetical order.
   *
   * @returns A new iterable iterator object.
   */
  values(): IterableIterator<T>;

  /**
   * Returns a new Iterator object that contains a two-member array of
   * `[key, value]` for each element in the `Trie` object in alphabetical order.
   *
   * @returns The same return value as `entries()`: a new iterable iterator
   * object that yields the key-value pairs of the trie.
   */
  [Symbol.iterator](): IterableIterator<[string, T]>;
}

// The internal representation of a trie node, whose values are of any type
type Node = Record<string, any>;

const { keys } = Object;

// Does not consider the empty string a prefix of any string
const findKeyPrefixOf = (object: Node, string: string): string | undefined => {
  const { length } = string;
  let end = 1;
  while (end <= length) {
    const key = string.substring(0, end);
    if (Object.hasOwn(object, key)) {
      return key;
    }

    end += 1;
  }

  return undefined;
};

// Does not consider the empty string a prefix of a non-empty string
const findKeyWithCommonPrefix = (object: Node, string: string): string | undefined => {
  const char = string.charAt(0);
  for (const key in object) {
    if (Object.hasOwn(object, key) && key.charAt(0) === char) {
      return key;
    }
  }

  return undefined;
};

const findFirstKey = (object: Node): string | undefined => {
  let first: string | undefined;
  for (const key in object) {
    if (Object.hasOwn(object, key) && (!first || first > key)) {
      first = key;
    }
  }

  return first;
};

const findNextKey = (object: Node, currentKey: string): string | undefined => {
  let next: string | undefined;
  for (const key in object) {
    if (Object.hasOwn(object, key) && key > currentKey && (!next || next > key)) {
      next = key;
    }
  }

  return next;
};

const findFirstBranch = (root: Node): Node | undefined => {
  for (const key in root) {
    if (Object.hasOwn(root, key)) {
      return root;
    }
  }

  return undefined;
};

const findLastBranch = (root: Node, string: string): Node | undefined => {
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
const findNextBranch = (root: Node, path: string[]): Node | undefined => {
  // Traverse the path storing the nodes along it
  path.pop();
  const { length } = path;
  const nodes: Node[] = [];
  let key: string | undefined = "";
  let node: Node = root;
  let step = 0;
  while (node && step < length) {
    nodes.push(node);
    node = node[path[step]];
    step += 1;
  }

  // If the path diverged, find the first branch after the diversion point
  if (!node) {
    let suffix = path.splice(step - 1).join("");
    node = nodes.pop() as Node;
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

    node = nodes.pop() as Node;
    key = findNextKey(node, path.pop() as string);
  }

  path.push(key);
  return node[key];
};

// Iterates over keys if `index` is 0, values if it is 1, or entries otherwise
const createIterator = <T>(root: Node, index?: 0 | 1): IterableIterator<T> => {
  const path: string[] = [];
  let done = false;
  const iterator: IterableIterator<T> = {
    next(): IteratorResult<T> {
      if (done) {
        return { done: true, value: undefined };
      }

      // Find the next branch node
      const findBranch = path.length === 0 ? findFirstBranch : findNextBranch;
      const branch = findBranch(root, path);
      if (!branch) {
        done = true;
        return { done: true, value: undefined };
      }

      // Find the first branch node with a leaf in the current branch
      let node = branch;
      while (!Object.hasOwn(node, "")) {
        const key = findFirstKey(node) as string;
        path.push(key);
        node = node[key];
      }

      path.push("");
      return {
        done: false,
        value: index === 0 ? path.join("") : index === 1 ? node[""] : [path.join(""), node[""]],
      };
    },
    [Symbol.iterator]: () => iterator,
  };

  return iterator;
};

/**
 * Creates a new `Trie` object.
 *
 * @param iterable An `Array` or other iterable object whose elements are
 * key-value pairs. (For example, arrays with two elements, such as
 * `[["one", 1], ["two", 2]]`.) Each key-value pair is added to the new
 * `Trie`. Or a `TrieNode`, such as the one returned by `trie.root`. If a
 * `TrieNode` is given, it may be deeply mutated.
 * @returns The new `Trie` object.
 */
export default function createTrie<T>(
  iterable?: ArrayLike<readonly [string, T]> | Iterable<readonly [string, T]> | TrieNode<T> | null,
): Trie<T> {
  if (typeof iterable !== "object" && typeof iterable !== "undefined") {
    throw TypeError();
  }

  let root: Node = {};
  let size = 0;
  let isSizeMemoized = true;
  const trie: Trie<T> = {
    get root() {
      return root;
    },

    get size() {
      if (!isSizeMemoized) {
        const iterator = createIterator(root, 1);
        isSizeMemoized = true;
        size = 0;
        while (!iterator.next().done) {
          size += 1;
        }
      }

      return size;
    },

    clear() {
      size = 0;

      // Delete the keys of the root because suspended iterators reference it
      keys(root).forEach((key) => delete root[key]);
    },

    delete(key) {
      let grandparent: Node | undefined;
      let parentKey = "";
      let parent: Node | undefined;
      let nodeKey = "";
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

      if (suffix.length > 0 || !Object.hasOwn(node, "")) {
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

    entries() {
      return createIterator(root);
    },

    forEach(callbackfn, thisArg) {
      const boundCallbackfn = callbackfn.bind(thisArg);
      const iterator = createIterator<[string, T]>(root);
      let { done, value = [] } = iterator.next();
      while (!done) {
        boundCallbackfn(value[1] as T, value[0] as string, trie);
        ({ done, value = [] } = iterator.next());
      }
    },

    get(key) {
      const node = findLastBranch(root, String(key));
      return node ? node[""] : undefined;
    },

    has(key) {
      const node = findLastBranch(root, String(key));
      return node ? Object.hasOwn(node, "") : false;
    },

    keys() {
      return createIterator(root, 0);
    },

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
          [suffix.substring(pos)]: pos === suffix.length ? value : { "": value },
        };
        delete node[keyToSplit];
      } else {
        node[suffix] = { "": value };
      }

      return trie;
    },

    values() {
      return createIterator(root, 1);
    },
    [Symbol.iterator]: () => createIterator(root),
  };

  if (Array.isArray(iterable)) {
    // Initialize from array-like
    Array.prototype.forEach.call(iterable, (entry: ArrayLike<unknown>) =>
      trie.set(entry[0] as string, entry[1] as T),
    );
  } else if (iterable != null && Symbol.iterator in iterable) {
    // Initialize from iterable iterator
    const iterator = (iterable as Iterable<ArrayLike<unknown>>)[Symbol.iterator]();
    let { done, value } = iterator.next();
    while (!done) {
      if (typeof value !== "object") {
        throw TypeError();
      }

      trie.set(value[0] as string, value[1] as T);
      ({ done, value } = iterator.next());
    }
  } else if (iterable != null) {
    // Initialize from trie node object
    root = iterable as Node;
    isSizeMemoized = false;
  } else {
    root = {};
  }

  return trie;
}
