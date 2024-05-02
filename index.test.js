import test from "node:test";
import assert from "node:assert/strict";
import trieMapping from "./index.js";

test("trie-mapping with an invalid argument", () => {
  assert.throws(() => trieMapping(false), TypeError);
  assert.throws(() => trieMapping(0), TypeError);
  assert.throws(() => trieMapping(""), TypeError);
  assert.throws(() => trieMapping(() => {}), TypeError);
});

test("trie-mapping with no elements", () => {
  assert.deepEqual(trieMapping().root, {});
  assert.deepEqual(trieMapping(null).root, {});
  assert.deepEqual(trieMapping([]).root, {});
  assert.deepEqual(trieMapping({}).root, {});
});

test("trie-mapping with an array of arrays", () => {
  assert.deepEqual(
    trieMapping([
      ["hey", 0],
      ["hi", 1],
    ]).root,
    { h: { ey: { "": 0 }, i: { "": 1 } } },
  );
  assert.deepEqual(
    trieMapping([
      ["hey", 0],
      ["hi", 1],
      ["hey", 2],
    ]).root,
    { h: { ey: { "": 2 }, i: { "": 1 } } },
  );
});

test("trie-mapping with an array of objects", () => {
  assert.deepEqual(
    trieMapping([
      { 0: "hey", 1: 0 },
      { 0: "hi", 1: 1 },
    ]).root,
    { h: { ey: { "": 0 }, i: { "": 1 } } },
  );
  assert.deepEqual(
    trieMapping([
      { 0: "hey", 1: 0 },
      { 0: "hi", 1: 1 },
      { 0: "hey", 1: 2 },
    ]).root,
    { h: { ey: { "": 2 }, i: { "": 1 } } },
  );
});

test("trie-mapping with a native iterable", () => {
  assert.deepEqual(
    trieMapping(
      new Map([
        ["hey", 0],
        ["hi", 1],
      ]),
    ).root,
    { h: { ey: { "": 0 }, i: { "": 1 } } },
  );
});

test("trie-mapping with an invalid custom iterable", () => {
  assert.throws(() => trieMapping({ [Symbol.iterator]: undefined }), TypeError);
  assert.throws(
    () =>
      trieMapping({
        [Symbol.iterator]() {
          return {};
        },
      }),
    TypeError,
  );
  assert.throws(
    () =>
      trieMapping({
        [Symbol.iterator]() {
          const values = ["hey", "hi"];
          let index = -1;
          return {
            next() {
              index += 1;
              return index >= values.length
                ? { done: true, value: undefined }
                : { done: false, value: values[index] };
            },
          };
        },
      }),
    TypeError,
  );
});

assert.deepEqual(
  trieMapping({
    [Symbol.iterator]() {
      const values = [
        ["hey", 0],
        ["hi", 1],
      ];
      let index = -1;
      return {
        next() {
          index += 1;
          return index >= values.length
            ? { done: true, value: undefined }
            : { done: false, value: values[index] };
        },
      };
    },
  }).root,
  { h: { ey: { "": 0 }, i: { "": 1 } } },
);

test("trie-mapping with a trie's root object", () => {
  assert.deepEqual(trieMapping({ h: { ey: { "": 0 }, i: { "": 1 } } }).root, {
    h: { ey: { "": 0 }, i: { "": 1 } },
  });
});

test("trie-mapping size with an empty trie", () => {
  assert.equal(trieMapping().size, 0);
  assert.equal(trieMapping(null).size, 0);
  assert.equal(trieMapping([]).size, 0);
  assert.equal(trieMapping({}).size, 0);
});

test("trie-mapping size with a non-empty trie", () => {
  assert.equal(trieMapping([["hi", 0]]).size, 1);
  assert.equal(trieMapping([["hi"]]).size, 1);
  assert.equal(
    trieMapping([
      ["hi", 0],
      ["hey", 1],
    ]).size,
    2,
  );
  assert.equal(trieMapping([["hi"], ["hey"]]).size, 2);
  assert.equal(trieMapping([["hi", 0]]).size, 1);
  assert.equal(trieMapping([["hi"]]).size, 1);
  assert.equal(
    trieMapping([
      ["hi", 0],
      ["hey", 1],
    ]).size,
    2,
  );
  assert.equal(trieMapping([["hi"], ["hey"]]).size, 2);
  assert.equal(trieMapping({ "": 0 }).size, 1);
  assert.equal(trieMapping({ h: { i: { "": 0 } }, ey: { "": 1 } }).size, 2);
});

test("trie-mapping root with an empty trie", () => {
  assert.deepEqual(trieMapping().root, {});
  assert.deepEqual(trieMapping(null).root, {});
  assert.deepEqual(trieMapping([]).root, {});
  assert.deepEqual(trieMapping({}).root, {});
});

test("trie-mapping root with a non-empty trie", () => {
  assert.deepEqual(
    trieMapping([
      ["he", 1],
      ["hey", 5],
      ["hells", 4],
      ["hello", 3],
      ["hell", 2],
      ["bye", 0],
    ]).root,
    {
      he: { "": 1, y: { "": 5 }, ll: { s: { "": 4 }, o: { "": 3 }, "": 2 } },
      bye: { "": 0 },
    },
  );
  assert.deepEqual(
    trieMapping([
      ["h", 0],
      ["he", 1],
      ["hello", 2],
      ["hey", 3],
    ]).root,
    { h: { "": 0, e: { "": 1, llo: { "": 2 }, y: { "": 3 } } } },
  );
});

test("trie-mapping clear() with an empty trie", () => {
  const trie = trieMapping();
  assert.equal(trie.clear(), undefined);
  assert.deepEqual(trie.root, {});
});

test("trie-mapping clear() with a non-empty trie", () => {
  const trie = trieMapping([
    ["hi", 1],
    ["hey", 0],
  ]);
  assert.equal(trie.clear(), undefined);
  assert.deepEqual(trie.root, {});
});

test("trie-mapping delete() with a key that does not exist", () => {
  const emptyString = trieMapping();
  assert.equal(emptyString.delete(""), false);
  assert.deepEqual(emptyString.root, {});

  const oneLetter = trieMapping();
  assert.equal(oneLetter.delete("h"), false);
  assert.deepEqual(oneLetter.root, {});

  const oneLetterMore = trieMapping([["hell", 0]]);
  assert.equal(oneLetterMore.delete("hello"), false);
  assert.deepEqual(oneLetterMore.root, { hell: { "": 0 } });

  const manyLettersMore = trieMapping([["he", 0]]);
  assert.equal(manyLettersMore.delete("hello"), false);
  assert.deepEqual(manyLettersMore.root, { he: { "": 0 } });

  const oneLetterLess = trieMapping([["hello", 0]]);
  assert.equal(oneLetterLess.delete("hell"), false);
  assert.deepEqual(oneLetterLess.root, { hello: { "": 0 } });

  const manyLettersLess = trieMapping([["hello", 0]]);
  assert.equal(manyLettersLess.delete("he"), false);
  assert.deepEqual(manyLettersLess.root, { hello: { "": 0 } });

  const oneDifferentLetter = trieMapping([["hello", 0]]);
  assert.equal(oneDifferentLetter.delete("hells"), false);
  assert.deepEqual(oneDifferentLetter.root, { hello: { "": 0 } });

  const manyDifferentLetters = trieMapping([["hello", 0]]);
  assert.equal(manyDifferentLetters.delete("helio"), false);
  assert.deepEqual(manyDifferentLetters.root, { hello: { "": 0 } });
});

test("trie-mapping delete() with a key that exists", () => {
  const emptyString = trieMapping([["", undefined]]);
  assert.equal(emptyString.delete(""), true);
  assert.deepEqual(emptyString.root, {});

  const noSiblings = trieMapping([["h", 0]]);
  assert.equal(noSiblings.delete("h"), true);
  assert.deepEqual(noSiblings.root, {});

  const oneSibling = trieMapping([
    ["him", 0],
    ["his", 1],
  ]);
  assert.equal(oneSibling.delete("his"), true);
  assert.deepEqual(oneSibling.root, { him: { "": 0 } });

  const onlyEmptyStringSibling = trieMapping([
    ["hi", 0],
    ["his", 1],
  ]);
  assert.equal(onlyEmptyStringSibling.delete("his"), true);
  assert.deepEqual(onlyEmptyStringSibling.root, { hi: { "": 0 } });

  const manySiblings = trieMapping([
    ["hi", 1],
    ["him", 2],
    ["his", 3],
  ]);
  assert.equal(manySiblings.delete("his"), true);
  assert.deepEqual(manySiblings.root, { hi: { "": 1, m: { "": 2 } } });

  const noSuccessors = trieMapping([
    ["hi", 0],
    ["bye", 1],
  ]);
  assert.equal(noSuccessors.delete("bye"), true);
  assert.deepEqual(noSuccessors.root, { hi: { "": 0 } });

  const oneSuccessor = trieMapping([
    ["hi", 1],
    ["his", 2],
  ]);
  assert.equal(oneSuccessor.delete("hi"), true);
  assert.deepEqual(oneSuccessor.root, { his: { "": 2 } });

  const manySuccessors = trieMapping([
    ["hi", 1],
    ["him", 2],
    ["his", 3],
  ]);
  assert.equal(manySuccessors.delete("hi"), true);
  assert.deepEqual(manySuccessors.root, { hi: { m: { "": 2 }, s: { "": 3 } } });
});

test("trie-mapping delete() with a key that exists (repeatedly)", () => {
  const trie = trieMapping([["hi", 1]]);
  assert.equal(trie.delete("hi"), true);
  assert.equal(trie.delete("hi"), false);
});

test("trie-mapping entries() with Symbol.iterator", () => {
  const iterator = trieMapping().entries();
  assert.equal(typeof iterator[Symbol.iterator], "function");
  assert.equal(iterator, iterator[Symbol.iterator]());
});

test("trie-mapping entries() with an empty trie", () => {
  assert.deepEqual([...trieMapping().entries()], []);
  assert.deepEqual([...trieMapping(Object.create({ hi: 0 })).entries()], []);

  const iterator = trieMapping().entries();
  assert.deepEqual(iterator.next() && iterator.next(), {
    done: true,
    value: undefined,
  });
});

test("trie-mapping entries() with a non-empty trie", () => {
  assert.deepEqual(
    [
      ...trieMapping([
        ["", 0],
        ["a", 1],
        ["aac", 4],
        ["aaa", 2],
        ["aab", 3],
      ]).entries(),
    ],
    [
      ["", 0],
      ["a", 1],
      ["aaa", 2],
      ["aab", 3],
      ["aac", 4],
    ],
  );
  assert.deepEqual(
    [...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).entries()],
    [
      ["", 1],
      ["llo", 2],
      ["y", 3],
    ],
  );
  assert.deepEqual(
    [
      ...trieMapping({
        "": 0,
        e: { "": 1, llo: { "": 2 }, y: { "": 3 } },
      }).entries(),
    ],
    [
      ["", 0],
      ["e", 1],
      ["ello", 2],
      ["ey", 3],
    ],
  );
  assert.deepEqual(
    [...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).entries()],
    [
      ["", 1],
      ["llo", 2],
      ["y", 3],
    ],
  );
});

test("trie-mapping entries() with clear() while suspended", () => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0],
  ]);
  const iterator1 = trie.entries();
  const iterator2 = trie.entries();
  assert.deepEqual(iterator1.next(), { done: false, value: ["hello", 0] });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  assert.deepEqual(iterator1.next(), { done: false, value: ["hey", 1] });
  assert.deepEqual(iterator1.next(), { done: true, value: undefined });
  assert.deepEqual(iterator2.next(), { done: false, value: ["he", 0] });
  assert.deepEqual(iterator2.next(), { done: false, value: ["hey", 1] });
  assert.deepEqual(iterator2.next(), { done: true, value: undefined });
});

test("trie-mapping forEach() with an empty trie", () => {
  const callbackfn = test.mock.fn();
  trieMapping().forEach(callbackfn);
  assert.equal(callbackfn.mock.callCount(), 0);

  const callbackfn2 = test.mock.fn();
  trieMapping(Object.create({ hi: 0 })).forEach(callbackfn2);
  assert.equal(callbackfn2.mock.callCount(), 0);
});

test("trie-mapping forEach() with a non-empty trie", () => {
  const trie = trieMapping([
    ["", 0],
    ["a", 1],
    ["aac", 4],
    ["aaa", 2],
    ["aab", 3],
  ]);
  const callbackArgs = [];
  trie.forEach((...args) => callbackArgs.push([...args]));
  assert.deepEqual(callbackArgs, [
    [0, "", trie],
    [1, "a", trie],
    [2, "aaa", trie],
    [3, "aab", trie],
    [4, "aac", trie],
  ]);
});

test("trie-mapping forEach() with a callbackfn that adds keys", () => {
  const trie = trieMapping([
    ["", 0],
    ["a", 1],
    ["aac", 4],
    ["aab", 3],
    ["aaa", 2],
  ]);
  const callbackArgs = [];
  trie.forEach((value, key, trie) => {
    callbackArgs.push([value, key]);
    if (value > 0 && value < 3) {
      // Should be visited because it is higher alphabetically
      trie.set(`${key}N`, value + 1);
    }

    if (key === "aac") {
      // Should not be visited because it is lower alphabetically
      trie.set(`a`, value - 1);
    }
  });
  assert.deepEqual(callbackArgs, [
    [0, ""],
    [1, "a"],
    [2, "aN"],
    [3, "aNN"],
    [2, "aaa"],
    [3, "aaaN"],
    [3, "aab"],
    [4, "aac"],
  ]);
});

test("trie-mapping forEach() with a callbackfn that deletes keys", () => {
  const trie = trieMapping([
    ["", 0],
    ["a", 1],
    ["ab", 3],
    ["aa", 2],
  ]);
  const callbackArgs = [];
  trie.forEach((value, key, trie) => {
    callbackArgs.push([value, key]);
    trie.delete("ab");
  });
  assert.deepEqual(callbackArgs, [
    [0, ""],
    [1, "a"],
    [2, "aa"],
  ]);
});

test("trie-mapping forEach() with thisArg", () => {
  const trie = trieMapping([
    ["", 0],
    ["a", 1],
    ["ab", 3],
    ["aa", 2],
  ]);
  const store = {
    items: [],
    addItem(item) {
      this.items.push(item);
    },
  };
  trie.forEach(function (...args) {
    this.addItem([...args]);
  }, store);
  assert.deepEqual(store.items, [
    [0, "", trie],
    [1, "a", trie],
    [2, "aa", trie],
    [3, "ab", trie],
  ]);
});

test("trie-mapping get() with a key that does not exist", () => {
  assert.equal(trieMapping().get(1), undefined);
  assert.equal(trieMapping().get(""), undefined);
  assert.equal(trieMapping().get("hello"), undefined);
  assert.equal(trieMapping([["hello", 0]]).get("he"), undefined);
  assert.equal(trieMapping([["hello", 0]]).get("hell"), undefined);
  assert.equal(trieMapping([["hello", 0]]).get("hey"), undefined);
  assert.equal(trieMapping([["he", 0]]).get("hello"), undefined);
  assert.equal(trieMapping([["hell", 0]]).get("hello"), undefined);
  assert.equal(trieMapping([["hey", 0]]).get("hello"), undefined);
  assert.equal(trieMapping([["hello", 0]]).get("hells"), undefined);
});

test("trie-mapping get() with a key that exists", () => {
  assert.equal(trieMapping([[1, 0]]).get(1), 0);
  assert.equal(trieMapping([["", undefined]]).get(""), undefined);
  assert.equal(trieMapping([["hello", 0]]).get("hello"), 0);
  assert.equal(
    trieMapping([
      ["hello", 1],
      ["he", 0],
    ]).get("he"),
    0,
  );
  assert.equal(
    trieMapping([
      ["hello", 1],
      ["hell", 0],
    ]).get("hell"),
    0,
  );
  assert.equal(
    trieMapping([
      ["hello", 0],
      ["hey", 1],
    ]).get("hey"),
    1,
  );
  assert.equal(
    trieMapping([
      ["hello", 1],
      ["he", 0],
    ]).get("hello"),
    1,
  );
  assert.equal(
    trieMapping([
      ["hello", 1],
      ["hell", 0],
    ]).get("hello"),
    1,
  );
  assert.equal(
    trieMapping([
      ["hello", 0],
      ["hey", 1],
    ]).get("hello"),
    0,
  );
  assert.equal(
    trieMapping([
      ["hello", 0],
      ["hells", 1],
    ]).get("hells"),
    1,
  );
});

test("trie-mapping has() with a key that does not exist", () => {
  assert.equal(trieMapping().has(1), false);
  assert.equal(trieMapping().has(""), false);
  assert.equal(trieMapping([["hey"]]).has("hello"), false);
  assert.equal(trieMapping([["hello"]]).has("hey"), false);
  assert.equal(trieMapping([["hell"]]).has("hello"), false);
  assert.equal(trieMapping([["hello"]]).has("hell"), false);
});

test("trie-mapping has() with a key that exists", () => {
  assert.equal(trieMapping([["1", 0]]).has(1), true);
  assert.equal(trieMapping([["", undefined]]).has(""), true);
  assert.equal(
    trieMapping([
      ["hello", 1],
      ["hey", 0],
    ]).has("hello"),
    true,
  );
  assert.equal(
    trieMapping([
      ["hey", 0],
      ["hello", 1],
    ]).has("hey"),
    true,
  );
  assert.equal(
    trieMapping([
      ["hello", 0],
      ["hell", 1],
    ]).has("hello"),
    true,
  );
  assert.equal(
    trieMapping([
      ["hell", 0],
      ["hello", 1],
    ]).has("hell"),
    true,
  );
});

test("trie-mapping keys() with Symbol.iterator", () => {
  const iterator = trieMapping().keys();
  assert.equal(typeof iterator[Symbol.iterator], "function");
  assert.equal(iterator, iterator[Symbol.iterator]());
});

test("trie-mapping keys() with an empty trie", () => {
  assert.deepEqual([...trieMapping().keys()], []);
  assert.deepEqual([...trieMapping(Object.create({ hi: 0 })).keys()], []);
  const iterator = trieMapping().keys();
  assert.deepEqual(iterator.next() && iterator.next(), {
    done: true,
    value: undefined,
  });
});

test("trie-mapping keys() with a non-empty trie", () => {
  assert.deepEqual(
    [
      ...trieMapping([
        ["", 0],
        ["a", 1],
        ["aac", 4],
        ["aaa", 2],
        ["aab", 3],
      ]).keys(),
    ],
    ["", "a", "aaa", "aab", "aac"],
  );
  assert.deepEqual(
    [...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).keys()],
    ["", "llo", "y"],
  );
});

test("trie-mapping keys() with clear() while suspended", () => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0],
  ]);
  const iterator1 = trie.keys();
  const iterator2 = trie.keys();
  assert.deepEqual(iterator1.next(), { done: false, value: "hello" });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  assert.deepEqual(iterator1.next(), { done: false, value: "hey" });
  assert.deepEqual(iterator1.next(), { done: true, value: undefined });
  assert.deepEqual(iterator2.next(), { done: false, value: "he" });
  assert.deepEqual(iterator2.next(), { done: false, value: "hey" });
  assert.deepEqual(iterator2.next(), { done: true, value: undefined });
});

test("trie-mapping set() with a key that does not exist", () => {
  assert.deepEqual(trieMapping().set(1, 0).root, { 1: { "": 0 } });
  assert.deepEqual(trieMapping().set("", undefined).root, { "": undefined });
  assert.deepEqual(trieMapping().set("hi", 0).root, { hi: { "": 0 } });
  assert.deepEqual(
    trieMapping([
      ["hey", 0],
      ["hello", 1],
    ]).set("hi", 2).root,
    { h: { e: { y: { "": 0 }, llo: { "": 1 } }, i: { "": 2 } } },
  );
  assert.deepEqual(
    trieMapping([
      ["hey", 0],
      ["hello", 1],
    ]).set("hell", 2).root,
    { he: { y: { "": 0 }, ll: { o: { "": 1 }, "": 2 } } },
  );
  assert.deepEqual(
    trieMapping([
      ["hey", 0],
      ["hello", 1],
    ]).set("hells", 2).root,
    { he: { y: { "": 0 }, ll: { o: { "": 1 }, s: { "": 2 } } } },
  );
});

test("trie-mapping set() with a key that exists", () => {
  assert.deepEqual(trieMapping([["1", 0]]).set(1, 1).root, { 1: { "": 1 } });
  assert.deepEqual(trieMapping([["", undefined]]).set("", null).root, {
    "": null,
  });
  assert.deepEqual(trieMapping([["hi", 0]]).set("hi", 1).root, {
    hi: { "": 1 },
  });
  assert.deepEqual(
    trieMapping([
      ["", 0],
      ["hey", 1],
    ]).set("", 2).root,
    { "": 2, hey: { "": 1 } },
  );
  assert.deepEqual(
    trieMapping([
      ["he", 0],
      ["hey", 1],
    ]).set("he", 2).root,
    { he: { "": 2, y: { "": 1 } } },
  );
  assert.deepEqual(
    trieMapping([
      ["he", 0],
      ["hey", 1],
    ]).set("hey", 2).root,
    { he: { "": 0, y: { "": 2 } } },
  );
});

test("trie-mapping values() with Symbol.iterator", () => {
  const iterator = trieMapping().values();
  assert.equal(typeof iterator[Symbol.iterator], "function");
  assert.equal(iterator, iterator[Symbol.iterator]());
});

test("trie-mapping values() with an empty trie", () => {
  assert.deepEqual([...trieMapping().values()], []);
  assert.deepEqual([...trieMapping(Object.create({ hi: 0 })).values()], []);
  const iterator = trieMapping().values();
  assert.deepEqual(iterator.next() && iterator.next(), {
    done: true,
    value: undefined,
  });
});

test("trie-mapping values() with a non-empty trie", () => {
  assert.deepEqual(
    [
      ...trieMapping([
        ["", 0],
        ["a", 1],
        ["aac", 4],
        ["aaa", 2],
        ["aab", 3],
      ]).values(),
    ],
    [0, 1, 2, 3, 4],
  );
  assert.deepEqual(
    [...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).values()],
    [1, 2, 3],
  );
});

test("trie-mapping values() with clear() while suspended", () => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0],
  ]);
  const iterator1 = trie.values();
  const iterator2 = trie.values();
  assert.deepEqual(iterator1.next(), { done: false, value: 0 });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  assert.deepEqual(iterator1.next(), { done: false, value: 1 });
  assert.deepEqual(iterator1.next(), { done: true, value: undefined });
  assert.deepEqual(iterator2.next(), { done: false, value: 0 });
  assert.deepEqual(iterator2.next(), { done: false, value: 1 });
  assert.deepEqual(iterator2.next(), { done: true, value: undefined });
});

test("trie-mapping [@@iterator]() with Symbol.iterator", () => {
  const iterator = trieMapping()[Symbol.iterator]();
  assert.equal(typeof iterator[Symbol.iterator], "function");
  assert.equal(iterator, iterator[Symbol.iterator]());
});

test("trie-mapping [@@iterator]() with an empty trie", () => {
  assert.deepEqual([...trieMapping()], []);
  assert.deepEqual([...trieMapping(Object.create({ hi: 0 }))], []);
  const iterator = trieMapping()[Symbol.iterator]();
  assert.deepEqual(iterator.next() && iterator.next(), {
    done: true,
    value: undefined,
  });
});

test("trie-mapping [@@iterator]() with a non-empty trie", () => {
  assert.deepEqual(
    [
      ...trieMapping([
        ["", 0],
        ["a", 1],
        ["aac", 4],
        ["aaa", 2],
        ["aab", 3],
      ]),
    ],
    [
      ["", 0],
      ["a", 1],
      ["aaa", 2],
      ["aab", 3],
      ["aac", 4],
    ],
  );
});

test("trie-mapping [@@iterator]() with clear() while suspended", () => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0],
  ]);
  const iterator1 = trie[Symbol.iterator]();
  const iterator2 = trie[Symbol.iterator]();
  assert.deepEqual(iterator1.next(), { done: false, value: ["hello", 0] });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  assert.deepEqual(iterator1.next(), { done: false, value: ["hey", 1] });
  assert.deepEqual(iterator1.next(), { done: true, value: undefined });
  assert.deepEqual(iterator2.next(), { done: false, value: ["he", 0] });
  assert.deepEqual(iterator2.next(), { done: false, value: ["hey", 1] });
  assert.deepEqual(iterator2.next(), { done: true, value: undefined });
});
