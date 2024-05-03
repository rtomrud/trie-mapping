interface TrieNode<T> {
  /**
   * The value associated to the node.
   */
  "": T;

  [key: string]: TrieNode<T> | T;
}

interface Trie<T> {
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
  forEach(
    callbackfn: (value: T, key: string, trie: Trie<T>) => void,
    thisArg?: Trie<T>,
  ): void;

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

/**
 * Creates a new `Trie` object.
 *
 * @param iterable An `Array` or other iterable object whose elements are
 * key-value pairs. (For example, arrays with two elements, such as
 * `[[ 1, 'one' ], [ 2, 'two' ]]`.) Each key-value pair is added to the new
 * `Trie`. Or a `TrieNode`, such as the one returned by `trie.root`. If a
 * `TrieNode` is given, it may be deeply mutated.
 * @returns The new `Trie` object.
 */
export default function createTrie<T>(
  iterable?: ArrayLike<T> | IterableIterator<T> | TrieNode<T>,
): Trie<T>;
