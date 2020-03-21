import test from "./node_modules/tape/index.js";
import trieMapping from "./index.js";

test("trie-mapping with an invalid argument", ({ throws, end }) => {
  throws(() => trieMapping(false), TypeError);
  throws(() => trieMapping(0), TypeError);
  throws(() => trieMapping(""), TypeError);
  throws(() => trieMapping(() => {}), TypeError);
  end();
});

test("trie-mapping with no elements", ({ deepEqual, end }) => {
  deepEqual(trieMapping().root, {});
  deepEqual(trieMapping(null).root, {});
  deepEqual(trieMapping([]).root, {});
  deepEqual(trieMapping({}).root, {});
  end();
});

test("trie-mapping with an array of arrays", ({ deepEqual, end }) => {
  deepEqual(
    trieMapping([
      ["hey", 0],
      ["hi", 1]
    ]).root,
    {
      h: {
        ey: { "": 0 },
        i: { "": 1 }
      }
    }
  );
  deepEqual(
    trieMapping([
      ["hey", 0],
      ["hi", 1],
      ["hey", 2]
    ]).root,
    {
      h: {
        ey: { "": 2 },
        i: { "": 1 }
      }
    }
  );
  end();
});

test("trie-mapping with an array of objects", ({ deepEqual, end }) => {
  deepEqual(
    trieMapping([
      { 0: "hey", 1: 0 },
      { 0: "hi", 1: 1 }
    ]).root,
    {
      h: {
        ey: { "": 0 },
        i: { "": 1 }
      }
    }
  );
  deepEqual(
    trieMapping([
      { 0: "hey", 1: 0 },
      { 0: "hi", 1: 1 },
      { 0: "hey", 1: 2 }
    ]).root,
    {
      h: {
        ey: { "": 2 },
        i: { "": 1 }
      }
    }
  );
  end();
});

test("trie-mapping with a native iterable", ({ deepEqual, end }) => {
  deepEqual(
    trieMapping(
      new Map([
        ["hey", 0],
        ["hi", 1]
      ])
    ).root,
    {
      h: {
        ey: { "": 0 },
        i: { "": 1 }
      }
    }
  );
  end();
});

test("trie-mapping with an invalid custom iterable", ({ throws, end }) => {
  throws(
    () => trieMapping({ [Symbol.iterator]: undefined }),
    TypeError,
    "throws TypeError when Symbol.iterator is not a function"
  );
  throws(
    () =>
      trieMapping({
        [Symbol.iterator]() {
          return {};
        }
      }),
    TypeError,
    "throws TypeError when it has no next() method"
  );
  throws(
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
            }
          };
        }
      }),
    TypeError,
    "throws TypeError when the iterator entry is not an object"
  );
  end();
});

test("trie-mapping with a valid custom iterable", ({ deepEqual, end }) => {
  deepEqual(
    trieMapping({
      [Symbol.iterator]() {
        const values = [
          ["hey", 0],
          ["hi", 1]
        ];
        let index = -1;
        return {
          next() {
            index += 1;
            return index >= values.length
              ? { done: true, value: undefined }
              : { done: false, value: values[index] };
          }
        };
      }
    }).root,
    {
      h: {
        ey: { "": 0 },
        i: { "": 1 }
      }
    }
  );
  end();
});

test("trie-mapping with a trie's root object", ({ deepEqual, end }) => {
  deepEqual(
    trieMapping({
      h: {
        ey: { "": 0 },
        i: { "": 1 }
      }
    }).root,
    {
      h: {
        ey: { "": 0 },
        i: { "": 1 }
      }
    }
  );
  end();
});

test("trie-mapping size with an empty trie", ({ equal, end }) => {
  equal(trieMapping().size, 0);
  equal(trieMapping(null).size, 0);
  equal(trieMapping([]).size, 0);
  equal(trieMapping({}).size, 0);
  end();
});

test("trie-mapping size with a non-empty trie", ({ equal, end }) => {
  equal(trieMapping([["hi", 0]]).size, 1);
  equal(trieMapping([["hi"]]).size, 1);
  equal(
    trieMapping([
      ["hi", 0],
      ["hey", 1]
    ]).size,
    2
  );
  equal(trieMapping([["hi"], ["hey"]]).size, 2);
  equal(trieMapping([["hi", 0]]).size, 1);
  equal(trieMapping([["hi"]]).size, 1);
  equal(
    trieMapping([
      ["hi", 0],
      ["hey", 1]
    ]).size,
    2
  );
  equal(trieMapping([["hi"], ["hey"]]).size, 2);
  equal(trieMapping({ "": 0 }).size, 1);
  equal(trieMapping({ h: { i: { "": 0 } }, ey: { "": 1 } }).size, 2);
  end();
});

test("trie-mapping root with an empty trie", ({ deepEqual, end }) => {
  deepEqual(trieMapping().root, {});
  deepEqual(trieMapping(null).root, {});
  deepEqual(trieMapping([]).root, {});
  deepEqual(trieMapping({}).root, {});
  end();
});

test("trie-mapping root with a non-empty trie", ({ deepEqual, end }) => {
  deepEqual(
    trieMapping([
      ["he", 1],
      ["hey", 5],
      ["hells", 4],
      ["hello", 3],
      ["hell", 2],
      ["bye", 0]
    ]).root,
    {
      he: {
        "": 1,
        y: { "": 5 },
        ll: {
          s: { "": 4 },
          o: { "": 3 },
          "": 2
        }
      },
      bye: { "": 0 }
    }
  );
  deepEqual(
    trieMapping([
      ["h", 0],
      ["he", 1],
      ["hello", 2],
      ["hey", 3]
    ]).root,
    {
      h: {
        "": 0,
        e: {
          "": 1,
          llo: { "": 2 },
          y: { "": 3 }
        }
      }
    }
  );
  end();
});

test("trie-mapping clear() with an empty trie", ({ deepEqual, equal, end }) => {
  const trie = trieMapping();
  equal(trie.clear(), undefined);
  deepEqual(trie.root, {});
  end();
});

test("trie-mapping clear() with a non-empty trie", ({
  deepEqual,
  equal,
  end
}) => {
  const trie = trieMapping([
    ["hi", 1],
    ["hey", 0]
  ]);
  equal(trie.clear(), undefined);
  deepEqual(trie.root, {});
  end();
});

test("trie-mapping delete() with a key that does not exist", ({
  deepEqual,
  equal,
  end
}) => {
  const number = trieMapping();
  equal(number.delete(1), false);
  deepEqual(number.root, {});

  const emptyString = trieMapping();
  equal(emptyString.delete(""), false);
  deepEqual(emptyString.root, {});

  const oneLetter = trieMapping();
  equal(oneLetter.delete("h"), false);
  deepEqual(oneLetter.root, {});

  const oneLetterMore = trieMapping([["hell", 0]]);
  equal(oneLetterMore.delete("hello"), false);
  deepEqual(oneLetterMore.root, { hell: { "": 0 } });

  const manyLettersMore = trieMapping([["he", 0]]);
  equal(manyLettersMore.delete("hello"), false);
  deepEqual(manyLettersMore.root, { he: { "": 0 } });

  const oneLetterLess = trieMapping([["hello", 0]]);
  equal(oneLetterLess.delete("hell"), false);
  deepEqual(oneLetterLess.root, { hello: { "": 0 } });

  const manyLettersLess = trieMapping([["hello", 0]]);
  equal(manyLettersLess.delete("he"), false);
  deepEqual(manyLettersLess.root, { hello: { "": 0 } });

  const oneDifferentLetter = trieMapping([["hello", 0]]);
  equal(oneDifferentLetter.delete("hells"), false);
  deepEqual(oneDifferentLetter.root, { hello: { "": 0 } });

  const manyDifferentLetters = trieMapping([["hello", 0]]);
  equal(manyDifferentLetters.delete("helio"), false);
  deepEqual(manyDifferentLetters.root, { hello: { "": 0 } });

  end();
});

test("trie-mapping delete() with a key that exists", ({
  deepEqual,
  equal,
  end
}) => {
  const number = trieMapping([[1, 0]]);
  equal(number.delete(1), true);
  deepEqual(number.root, {});

  const emptyString = trieMapping([["", undefined]]);
  equal(emptyString.delete(""), true);
  deepEqual(emptyString.root, {});

  const noSiblings = trieMapping([["h", 0]]);
  equal(noSiblings.delete("h"), true);
  deepEqual(noSiblings.root, {});

  const oneSibling = trieMapping([
    ["him", 0],
    ["his", 1]
  ]);
  equal(oneSibling.delete("his"), true);
  deepEqual(oneSibling.root, { him: { "": 0 } });

  const onlyEmptyStringSibling = trieMapping([
    ["hi", 0],
    ["his", 1]
  ]);
  equal(onlyEmptyStringSibling.delete("his"), true);
  deepEqual(onlyEmptyStringSibling.root, { hi: { "": 0 } });

  const manySiblings = trieMapping([
    ["hi", 1],
    ["him", 2],
    ["his", 3]
  ]);
  equal(manySiblings.delete("his"), true);
  deepEqual(manySiblings.root, { hi: { "": 1, m: { "": 2 } } });

  const noSuccessors = trieMapping([
    ["hi", 0],
    ["bye", 1]
  ]);
  equal(noSuccessors.delete("bye"), true);
  deepEqual(noSuccessors.root, { hi: { "": 0 } });

  const oneSuccessor = trieMapping([
    ["hi", 1],
    ["his", 2]
  ]);
  equal(oneSuccessor.delete("hi"), true);
  deepEqual(oneSuccessor.root, { his: { "": 2 } });

  const manySuccessors = trieMapping([
    ["hi", 1],
    ["him", 2],
    ["his", 3]
  ]);
  equal(manySuccessors.delete("hi"), true);
  deepEqual(manySuccessors.root, { hi: { m: { "": 2 }, s: { "": 3 } } });

  end();
});

test("trie-mapping delete() repeatedly with a key that exists", ({
  equal,
  end
}) => {
  const trie = trieMapping([["hi", 1]]);
  equal(trie.delete("hi"), true);
  equal(trie.delete("hi"), false);
  end();
});

test("trie-mapping entries() returns a well-formed iterable", ({
  equal,
  end
}) => {
  const iterator = trieMapping().entries();
  equal(typeof iterator.next, "function", "has next()");
  equal(typeof iterator[Symbol.iterator], "function", "has @@iterator");
  equal(iterator, iterator[Symbol.iterator](), "@@iterator returns itself");
  end();
});

test("trie-mapping entries() with an empty trie", ({ deepEqual, end }) => {
  deepEqual([...trieMapping().entries()], []);
  deepEqual([...trieMapping(Object.create({ hi: 0 })).entries()], []);

  const iterator = trieMapping().entries();
  deepEqual(
    iterator.next() && iterator.next(),
    { done: true, value: undefined },
    "returns a done iterator when calling next() on an already done iterator"
  );

  end();
});

test("trie-mapping entries() with a non-empty trie", ({ deepEqual, end }) => {
  deepEqual(
    [
      ...trieMapping([
        ["", 0],
        ["a", 1],
        ["aac", 4],
        ["aaa", 2],
        ["aab", 3]
      ]).entries()
    ],
    [
      ["", 0],
      ["a", 1],
      ["aaa", 2],
      ["aab", 3],
      ["aac", 4]
    ]
  );
  deepEqual(
    [...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).entries()],
    [
      ["", 1],
      ["llo", 2],
      ["y", 3]
    ]
  );
  deepEqual(
    [
      ...trieMapping({
        "": 0,
        e: {
          "": 1,
          llo: { "": 2 },
          y: { "": 3 }
        }
      }).entries()
    ],
    [
      ["", 0],
      ["e", 1],
      ["ello", 2],
      ["ey", 3]
    ]
  );
  deepEqual(
    [
      ...trieMapping({
        "": 1,
        llo: { "": 2 },
        y: { "": 3 }
      }).entries()
    ],
    [
      ["", 1],
      ["llo", 2],
      ["y", 3]
    ]
  );
  end();
});

test("trie-mapping entries() with clear() while suspended", ({
  deepEqual,
  end
}) => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0]
  ]);
  const iterator1 = trie.entries();
  const iterator2 = trie.entries();
  deepEqual(iterator1.next(), { done: false, value: ["hello", 0] });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  deepEqual(iterator1.next(), { done: false, value: ["hey", 1] });
  deepEqual(iterator1.next(), { done: true, value: undefined });
  deepEqual(iterator2.next(), { done: false, value: ["he", 0] });
  deepEqual(iterator2.next(), { done: false, value: ["hey", 1] });
  deepEqual(iterator2.next(), { done: true, value: undefined });
  end();
});

test("trie-mapping forEach() with an empty trie", ({ deepEqual, end }) => {
  let wasCalledOnEmptyTrie = false;
  trieMapping().forEach(() => {
    wasCalledOnEmptyTrie = true;
  });
  deepEqual(
    wasCalledOnEmptyTrie,
    false,
    "callbackfn is not called if trie is empty"
  );

  let wasCalledOnNonEmptyPrototype = false;
  trieMapping(Object.create({ hi: 0 })).forEach(() => {
    wasCalledOnNonEmptyPrototype = true;
  });
  deepEqual(
    wasCalledOnNonEmptyPrototype,
    false,
    "callbackfn is not called if trie is empty but prototype is not"
  );

  end();
});

test("trie-mapping forEach() with a non-empty trie", ({ deepEqual, end }) => {
  const trie = trieMapping([
    ["", 0],
    ["a", 1],
    ["aac", 4],
    ["aaa", 2],
    ["aab", 3]
  ]);
  const callbackArgs = [];
  trie.forEach((...args) => callbackArgs.push([...args]));
  deepEqual(
    callbackArgs,
    [
      [0, "", trie],
      [1, "a", trie],
      [2, "aaa", trie],
      [3, "aab", trie],
      [4, "aac", trie]
    ],
    "callbackfn is called with the value, key and trie as arguments"
  );
  end();
});

test("trie-mapping forEach() with a callbackfn that adds keys", ({
  deepEqual,
  end
}) => {
  const trie = trieMapping([
    ["", 0],
    ["a", 1],
    ["aac", 4],
    ["aab", 3],
    ["aaa", 2]
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
  deepEqual(
    callbackArgs,
    [
      [0, ""],
      [1, "a"],
      [2, "aN"],
      [3, "aNN"],
      [2, "aaa"],
      [3, "aaaN"],
      [3, "aab"],
      [4, "aac"]
    ],
    "added keys are visited if they are alphabetically after the current key"
  );
  end();
});

test("trie-mapping forEach() with a callbackfn that deletes keys", ({
  deepEqual,
  end
}) => {
  const trie = trieMapping([
    ["", 0],
    ["a", 1],
    ["ab", 3],
    ["aa", 2]
  ]);
  const callbackArgs = [];
  trie.forEach((value, key, trie) => {
    callbackArgs.push([value, key]);
    trie.delete("ab");
  });
  deepEqual(
    callbackArgs,
    [
      [0, ""],
      [1, "a"],
      [2, "aa"]
    ],
    "keys deleted after forEach begins and before being visited are not visited"
  );
  end();
});

test("trie-mapping forEach() with thisArg", ({ deepEqual, end }) => {
  const trie = trieMapping([
    ["", 0],
    ["a", 1],
    ["ab", 3],
    ["aa", 2]
  ]);
  const store = {
    items: [],
    addItem(item) {
      this.items.push(item);
    }
  };
  trie.forEach(function(...args) {
    this.addItem([...args]);
  }, store);
  deepEqual(
    store.items,
    [
      [0, "", trie],
      [1, "a", trie],
      [2, "aa", trie],
      [3, "ab", trie]
    ],
    "callbackfn is bound to thisArg"
  );
  end();
});

test("trie-mapping get() with a key that does not exist", ({ equal, end }) => {
  equal(trieMapping().get(1), undefined);
  equal(trieMapping().get(""), undefined);
  equal(trieMapping().get("hello"), undefined);
  equal(trieMapping([["hello", 0]]).get("he"), undefined);
  equal(trieMapping([["hello", 0]]).get("hell"), undefined);
  equal(trieMapping([["hello", 0]]).get("hey"), undefined);
  equal(trieMapping([["he", 0]]).get("hello"), undefined);
  equal(trieMapping([["hell", 0]]).get("hello"), undefined);
  equal(trieMapping([["hey", 0]]).get("hello"), undefined);
  equal(trieMapping([["hello", 0]]).get("hells"), undefined);
  end();
});

test("trie-mapping get() with a key that exists", ({ equal, end }) => {
  equal(trieMapping([[1, 0]]).get(1), 0);
  equal(trieMapping([["", undefined]]).get(""), undefined);
  equal(trieMapping([["hello", 0]]).get("hello"), 0);
  equal(
    trieMapping([
      ["hello", 1],
      ["he", 0]
    ]).get("he"),
    0
  );
  equal(
    trieMapping([
      ["hello", 1],
      ["hell", 0]
    ]).get("hell"),
    0
  );
  equal(
    trieMapping([
      ["hello", 0],
      ["hey", 1]
    ]).get("hey"),
    1
  );
  equal(
    trieMapping([
      ["hello", 1],
      ["he", 0]
    ]).get("hello"),
    1
  );
  equal(
    trieMapping([
      ["hello", 1],
      ["hell", 0]
    ]).get("hello"),
    1
  );
  equal(
    trieMapping([
      ["hello", 0],
      ["hey", 1]
    ]).get("hello"),
    0
  );
  equal(
    trieMapping([
      ["hello", 0],
      ["hells", 1]
    ]).get("hells"),
    1
  );
  end();
});

test("trie-mapping has() with a key that does not exist", ({ equal, end }) => {
  equal(trieMapping().has(1), false);
  equal(trieMapping().has(""), false);
  equal(trieMapping([["hey"]]).has("hello"), false);
  equal(trieMapping([["hello"]]).has("hey"), false);
  equal(trieMapping([["hell"]]).has("hello"), false);
  equal(trieMapping([["hello"]]).has("hell"), false);
  end();
});

test("trie-mapping has() with a key that exists", ({ equal, end }) => {
  equal(trieMapping([["1", 0]]).has(1), true);
  equal(trieMapping([["", undefined]]).has(""), true);
  equal(
    trieMapping([
      ["hello", 1],
      ["hey", 0]
    ]).has("hello"),
    true
  );
  equal(
    trieMapping([
      ["hey", 0],
      ["hello", 1]
    ]).has("hey"),
    true
  );
  equal(
    trieMapping([
      ["hello", 0],
      ["hell", 1]
    ]).has("hello"),
    true
  );
  equal(
    trieMapping([
      ["hell", 0],
      ["hello", 1]
    ]).has("hell"),
    true
  );
  end();
});

test("trie-mapping keys() returns a well-formed iterable", ({ equal, end }) => {
  const iterator = trieMapping().keys();
  equal(typeof iterator.next, "function", "has next()");
  equal(typeof iterator[Symbol.iterator], "function", "has @@iterator");
  equal(iterator, iterator[Symbol.iterator](), "@@iterator returns itself");
  end();
});

test("trie-mapping keys() with an empty trie", ({ deepEqual, end }) => {
  deepEqual([...trieMapping().keys()], []);
  deepEqual([...trieMapping(Object.create({ hi: 0 })).keys()], []);

  const iterator = trieMapping().keys();
  deepEqual(
    iterator.next() && iterator.next(),
    { done: true, value: undefined },
    "returns a done iterator when calling next() on an already done iterator"
  );

  end();
});

test("trie-mapping keys() with a non-empty trie", ({ deepEqual, end }) => {
  deepEqual(
    [
      ...trieMapping([
        ["", 0],
        ["a", 1],
        ["aac", 4],
        ["aaa", 2],
        ["aab", 3]
      ]).keys()
    ],
    ["", "a", "aaa", "aab", "aac"]
  );
  deepEqual(
    [...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).keys()],
    ["", "llo", "y"]
  );
  end();
});

test("trie-mapping keys() with clear() while suspended", ({
  deepEqual,
  end
}) => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0]
  ]);
  const iterator1 = trie.keys();
  const iterator2 = trie.keys();
  deepEqual(iterator1.next(), { done: false, value: "hello" });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  deepEqual(iterator1.next(), { done: false, value: "hey" });
  deepEqual(iterator1.next(), { done: true, value: undefined });
  deepEqual(iterator2.next(), { done: false, value: "he" });
  deepEqual(iterator2.next(), { done: false, value: "hey" });
  deepEqual(iterator2.next(), { done: true, value: undefined });
  end();
});

test("trie-mapping set() with a key that does not exist", ({
  deepEqual,
  end
}) => {
  deepEqual(trieMapping().set(1, 0).root, { "1": { "": 0 } });
  deepEqual(trieMapping().set("", undefined).root, { "": undefined });
  deepEqual(trieMapping().set("hi", 0).root, { hi: { "": 0 } });
  deepEqual(
    trieMapping([
      ["hey", 0],
      ["hello", 1]
    ]).set("hi", 2).root,
    {
      h: { e: { y: { "": 0 }, llo: { "": 1 } }, i: { "": 2 } }
    }
  );
  deepEqual(
    trieMapping([
      ["hey", 0],
      ["hello", 1]
    ]).set("hell", 2).root,
    {
      he: { y: { "": 0 }, ll: { o: { "": 1 }, "": 2 } }
    }
  );
  deepEqual(
    trieMapping([
      ["hey", 0],
      ["hello", 1]
    ]).set("hells", 2).root,
    {
      he: { y: { "": 0 }, ll: { o: { "": 1 }, s: { "": 2 } } }
    }
  );
  end();
});

test("trie-mapping set() with a key that exists", ({ deepEqual, end }) => {
  deepEqual(trieMapping([["1", 0]]).set(1, 1).root, { "1": { "": 1 } });
  deepEqual(trieMapping([["", undefined]]).set("", null).root, { "": null });
  deepEqual(trieMapping([["hi", 0]]).set("hi", 1).root, { hi: { "": 1 } });
  deepEqual(
    trieMapping([
      ["", 0],
      ["hey", 1]
    ]).set("", 2).root,
    {
      "": 2,
      hey: { "": 1 }
    }
  );
  deepEqual(
    trieMapping([
      ["he", 0],
      ["hey", 1]
    ]).set("he", 2).root,
    {
      he: { "": 2, y: { "": 1 } }
    }
  );
  deepEqual(
    trieMapping([
      ["he", 0],
      ["hey", 1]
    ]).set("hey", 2).root,
    {
      he: { "": 0, y: { "": 2 } }
    }
  );
  end();
});

test("trie-mapping values() returns a well-formed iterable", ({
  equal,
  end
}) => {
  const iterator = trieMapping().values();
  equal(typeof iterator.next, "function", "has next()");
  equal(typeof iterator[Symbol.iterator], "function", "has @@iterator");
  equal(iterator, iterator[Symbol.iterator](), "@@iterator returns itself");
  end();
});

test("trie-mapping values() with an empty trie", ({ deepEqual, end }) => {
  deepEqual([...trieMapping().values()], []);
  deepEqual([...trieMapping(Object.create({ hi: 0 })).values()], []);

  const iterator = trieMapping().values();
  deepEqual(
    iterator.next() && iterator.next(),
    { done: true, value: undefined },
    "returns a done iterator when calling next() on an already done iterator"
  );

  end();
});

test("trie-mapping values() with a non-empty trie", ({ deepEqual, end }) => {
  deepEqual(
    [
      ...trieMapping([
        ["", 0],
        ["a", 1],
        ["aac", 4],
        ["aaa", 2],
        ["aab", 3]
      ]).values()
    ],
    [0, 1, 2, 3, 4]
  );
  deepEqual(
    [...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).values()],
    [1, 2, 3]
  );
  end();
});

test("trie-mapping values() with clear() while suspended", ({
  deepEqual,
  end
}) => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0]
  ]);
  const iterator1 = trie.values();
  const iterator2 = trie.values();
  deepEqual(iterator1.next(), { done: false, value: 0 });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  deepEqual(iterator1.next(), { done: false, value: 1 });
  deepEqual(iterator1.next(), { done: true, value: undefined });
  deepEqual(iterator2.next(), { done: false, value: 0 });
  deepEqual(iterator2.next(), { done: false, value: 1 });
  deepEqual(iterator2.next(), { done: true, value: undefined });
  end();
});

test("trie-mapping [@@iterator]() returns a well-formed iterable", ({
  equal,
  end
}) => {
  const iterator = trieMapping()[Symbol.iterator]();
  equal(typeof iterator.next, "function", "has next()");
  equal(typeof iterator[Symbol.iterator], "function", "has @@iterator");
  equal(iterator, iterator[Symbol.iterator](), "@@iterator returns itself");
  end();
});

test("trie-mapping [@@iterator]() with an empty trie", ({ deepEqual, end }) => {
  deepEqual([...trieMapping()], []);
  deepEqual([...trieMapping(Object.create({ hi: 0 }))], []);

  const iterator = trieMapping()[Symbol.iterator]();
  deepEqual(
    iterator.next() && iterator.next(),
    { done: true, value: undefined },
    "returns a done iterator when calling next() on an already done iterator"
  );

  end();
});

test("trie-mapping [@@iterator]() with a non-empty trie", ({
  deepEqual,
  end
}) => {
  deepEqual(
    [
      ...trieMapping([
        ["", 0],
        ["a", 1],
        ["aac", 4],
        ["aaa", 2],
        ["aab", 3]
      ])
    ],
    [
      ["", 0],
      ["a", 1],
      ["aaa", 2],
      ["aab", 3],
      ["aac", 4]
    ]
  );
  end();
});

test("trie-mapping [@@iterator]() with clear() while suspended", ({
  deepEqual,
  end
}) => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0]
  ]);
  const iterator1 = trie[Symbol.iterator]();
  const iterator2 = trie[Symbol.iterator]();
  deepEqual(iterator1.next(), { done: false, value: ["hello", 0] });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  deepEqual(iterator1.next(), { done: false, value: ["hey", 1] });
  deepEqual(iterator1.next(), { done: true, value: undefined });
  deepEqual(iterator2.next(), { done: false, value: ["he", 0] });
  deepEqual(iterator2.next(), { done: false, value: ["hey", 1] });
  deepEqual(iterator2.next(), { done: true, value: undefined });
  end();
});

test("trie-mapping when there's no Symbol.iterator, e.g., IE 11", ({
  equal,
  deepEqual,
  throws,
  end
}) => {
  const symbol = Symbol;
  Symbol = undefined; // eslint-disable-line no-global-assign
  const trie = trieMapping([
    ["hi", 0],
    ["hey", 1]
  ]);
  const keysIterator = trie.keys();
  const entriesIterator = trie.entries();
  const valuesIterator = trie.values();
  Symbol = symbol; // eslint-disable-line no-global-assign

  equal(trie[Symbol.iterator], undefined);

  equal(keysIterator[Symbol.iterator], undefined);
  throws(() => [...keysIterator]);
  deepEqual(keysIterator.next(), { done: false, value: "hey" });
  deepEqual(keysIterator.next(), { done: false, value: "hi" });
  deepEqual(keysIterator.next(), { done: true, value: undefined });

  equal(entriesIterator[Symbol.iterator], undefined);
  throws(() => [...entriesIterator]);
  deepEqual(entriesIterator.next(), { done: false, value: ["hey", 1] });
  deepEqual(entriesIterator.next(), { done: false, value: ["hi", 0] });
  deepEqual(entriesIterator.next(), { done: true, value: undefined });

  equal(valuesIterator[Symbol.iterator], undefined);
  throws(() => [...valuesIterator]);
  deepEqual(valuesIterator.next(), { done: false, value: 1 });
  deepEqual(valuesIterator.next(), { done: false, value: 0 });
  deepEqual(valuesIterator.next(), { done: true, value: undefined });

  end();
});
