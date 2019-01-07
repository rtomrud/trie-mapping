import test from "./node_modules/tape/index.js";
import trieMapping from "./index.js";

test("trie-mapping with an invalid argument", ({ throws, end }) => {
  throws(() => trieMapping(true), TypeError);
  throws(() => trieMapping(false), TypeError);
  throws(() => trieMapping(0), TypeError);
  throws(() => trieMapping(""), TypeError);
  throws(() => trieMapping(() => {}), TypeError);
  throws(() => trieMapping(Function), TypeError);
  end();
});

test("trie-mapping with no elements", ({ equal, end }) => {
  equal(trieMapping().size, 0);
  equal(trieMapping(null).size, 0);
  equal(trieMapping([]).size, 0);
  equal(trieMapping({}).size, 0);
  equal(trieMapping({ size: 0 }).size, 0);
  end();
});

test("trie-mapping with an array of arrays", ({ equal, end }) => {
  const trie = trieMapping([["hi", 0], ["hey", 1]]);
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.has("hey"), true);
  equal(trie.get("hey"), 1);
  equal(trie.size, 2);
  end();
});

test("trie-mapping with an array of arrays with repeated keys", ({
  equal,
  end
}) => {
  const trie = trieMapping([["hi", 0], ["hey", 1], ["hey", 2]]);
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.has("hey"), true);
  equal(trie.get("hey"), 2);
  equal(trie.size, 2);
  end();
});

test("trie-mapping with an array of objects", ({ equal, end }) => {
  const trie = trieMapping([{ 0: "hi", 1: 0 }, { 0: "hey", 1: 1 }]);
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.has("hey"), true);
  equal(trie.get("hey"), 1);
  equal(trie.size, 2);
  end();
});

test("trie-mapping with an array of objects with repeated keys", ({
  equal,
  end
}) => {
  const trie = trieMapping([
    { 0: "hi", 1: 0 },
    { 0: "hey", 1: 1 },
    { 0: "hey", 1: 2 }
  ]);
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.has("hey"), true);
  equal(trie.get("hey"), 2);
  equal(trie.size, 2);
  end();
});

test("trie-mapping with a native iterable", ({ equal, end }) => {
  const trie = trieMapping(new Map([["hi", 0], ["hey", 1]]));
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.has("hey"), true);
  equal(trie.get("hey"), 1);
  equal(trie.size, 2);
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
          const values = ["hi", "hey"];
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

test("trie-mapping with a valid custom iterable", ({ equal, end }) => {
  const trie = trieMapping({
    [Symbol.iterator]() {
      const values = [["hi", 0], ["hey", 1]];
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
  });
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.has("hey"), true);
  equal(trie.get("hey"), 1);
  equal(trie.size, 2);
  end();
});

test("trie-mapping with a valid custom iterable with repeated keys", ({
  equal,
  end
}) => {
  const trie = trieMapping({
    [Symbol.iterator]() {
      const values = [["hi", 0], ["hey", 1], ["hey", 2]];
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
  });
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.has("hey"), true);
  equal(trie.get("hey"), 2);
  equal(trie.size, 2);
  end();
});

test("trie-mapping with a trie's root object", ({ equal, end }) => {
  const trie = trieMapping({
    size: 2,
    h: {
      i: { "": 0 },
      e: {
        y: { "": 1 }
      }
    }
  });
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.has("hey"), true);
  equal(trie.get("hey"), 1);
  equal(trie.size, 2);
  end();
});

test("trie-mapping with a trie's root object with null node", ({
  equal,
  end
}) => {
  const trie = trieMapping({
    size: 0,
    h: {
      i: undefined,
      e: {
        y: null
      }
    }
  });
  equal(trie.has("he"), false);
  equal(trie.get("he"), undefined);
  equal(trie.has("hi"), false);
  equal(trie.get("hi"), undefined);
  equal(trie.has("hey"), false);
  equal(trie.get("hey"), undefined);
  end();
});

test("trie-mapping root with an empty trie", ({ deepEqual, end }) => {
  deepEqual(trieMapping().root, { size: 0 });
  deepEqual(trieMapping([]).root, { size: 0 });
  deepEqual(trieMapping({}).root, { size: 0 });
  end();
});

test("trie-mapping root with a non-empty trie initialized from an array", ({
  deepEqual,
  end
}) => {
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
  );
  end();
});

test("trie-mapping root with a non-empty trie initialized from a root object", ({
  deepEqual,
  end
}) => {
  deepEqual(
    trieMapping({
      size: 5,
      h: {
        e: {
          "": 1,
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
    }).root,
    {
      size: 5,
      h: {
        e: {
          "": 1,
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
  );
  end();
});

test("trie-mapping root with a non-empty trie initialized by calling set()", ({
  deepEqual,
  end
}) => {
  deepEqual(
    trieMapping()
      .set("he", 1)
      .set("hey", 5)
      .set("hells", 4)
      .set("hello", 3)
      .set("hell", 2)
      .set("bye", 0).root,
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
  );
  end();
});

test("trie-mapping size with an empty trie", ({ equal, end }) => {
  equal(trieMapping().size, 0);
  end();
});

test("trie-mapping size with a non-empty trie", ({ equal, end }) => {
  equal(trieMapping([["hi", 0]]).size, 1);
  equal(trieMapping([["hi"]]).size, 1);
  equal(trieMapping([["hi", 0], ["hey", 1]]).size, 2);
  equal(trieMapping([["hi"], ["hey"]]).size, 2);
  end();
});

test("trie-mapping clear() with an empty trie", ({ equal, end }) => {
  const trie = trieMapping();
  equal(trie.clear(), undefined);
  equal(trie.size, 0);
  end();
});

test("trie-mapping clear() with a non-empty trie", ({ equal, end }) => {
  const trie = trieMapping([["hi", 1], ["hey", 0]]);
  equal(trie.clear(), undefined);
  equal(trie.size, 0);
  equal(trie.has("hi"), false);
  equal(trie.get("hi"), undefined);
  equal(trie.delete("hi"), false);
  equal(trie.has("hey"), false);
  equal(trie.get("hey"), undefined);
  equal(trie.delete("hey"), false);
  end();
});

test("trie-mapping clear() with a suspended iterator", ({
  equal,
  deepEqual,
  end
}) => {
  const trie = trieMapping([["hi", 1], ["hey", 0]]);
  const { next } = trie.entries();
  let { done, value } = next();
  equal(trie.clear(), undefined);
  equal(done, false);
  deepEqual(value, ["hey", 0]);
  ({ done, value } = next());
  equal(done, false);
  deepEqual(value, ["hi", 1]);
  ({ done, value } = next());
  equal(done, true);
  equal(value, undefined);
  end();
});

test("trie-mapping delete() with a key that does not exist", ({
  equal,
  end
}) => {
  equal(trieMapping().delete(), false);
  equal(trieMapping().delete(""), false);
  equal(trieMapping().delete("hello"), false);
  equal(trieMapping([["he"]]).delete("hello"), false);
  equal(trieMapping([["hell"]]).delete("hello"), false);
  equal(trieMapping([["hello"]]).delete("hell"), false);
  equal(trieMapping([["hello"]]).delete("hells"), false);
  end();
});

test("trie-mapping delete() with a key that exists", ({ equal, end }) => {
  equal(trieMapping([[]]).delete(), true);
  equal(trieMapping([[""]]).delete(""), true);
  equal(trieMapping([["hello"]]).delete("hello"), true);
  equal(trieMapping([["hello"], ["hi"]]).delete("hello"), true);
  equal(trieMapping([["hello man"], ["hello"], ["he"]]).delete("hello"), true);
  equal(trieMapping([["hello man"], ["hello"], ["he"]]).delete("hello"), true);
  end();
});

test("trie-mapping delete() repeatedly with a key that exists", ({
  equal,
  end
}) => {
  const trie = trieMapping([["hi", 1]]);
  equal(trie.delete("hi"), true);
  equal(trie.size, 0);
  equal(trie.delete("hi"), false);
  equal(trie.size, 0);
  end();
});

test("trie-mapping delete() keeps the trie compact", ({ deepEqual, end }) => {
  const trieWithSharedNode = trieMapping([["hi", 1], ["his", 2]]);
  trieWithSharedNode.delete("hi");
  deepEqual(
    trieWithSharedNode.root,
    { size: 1, h: { i: { s: { "": 2 } } } },
    "removes only the key if the node is shared with other keys"
  );

  const trieWithOwnNode = trieMapping([["hi", 1], ["him", 2], ["his", 3]]);
  trieWithOwnNode.delete("him");
  deepEqual(
    trieWithOwnNode.root,
    { size: 2, h: { i: { "": 1, s: { "": 3 } } } },
    "removes the node if it is not shared"
  );

  const trieWithOwnPath = trieMapping([["hello", 0], ["hey man", 1]]);
  trieWithOwnPath.delete("hey man");
  deepEqual(
    trieWithOwnPath.root,
    { size: 1, h: { e: { l: { l: { o: { "": 0 } } } } } },
    "removes all no longer needed intermediate nodes that are not shared"
  );

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
        ["b", 4],
        ["a", 1],
        ["aac", 3],
        ["aab", 2]
      ]).entries()
    ],
    [["", 0], ["a", 1], ["aab", 2], ["aac", 3], ["b", 4]]
  );
  end();
});

test("trie-mapping forEach() with an empty trie", ({ deepEqual, end }) => {
  let wasCalled = false;
  trieMapping().forEach(() => {
    wasCalled = true;
  });
  deepEqual(wasCalled, false, "callbackfn is not called if trie is empty");
  end();
});

test("trie-mapping forEach() with a non-empty trie", ({ deepEqual, end }) => {
  const trie = trieMapping([
    ["", 0],
    ["b", 4],
    ["a", 1],
    ["aac", 3],
    ["aab", 2]
  ]);
  const callbackArgs = [];
  trie.forEach((...args) => callbackArgs.push([...args]));
  deepEqual(
    callbackArgs,
    [
      [0, "", trie],
      [1, "a", trie],
      [2, "aab", trie],
      [3, "aac", trie],
      [4, "b", trie]
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
    ["b", 4],
    ["a", 1],
    ["aac", 3],
    ["aab", 2]
  ]);
  const callbackArgs = [];
  trie.forEach((value, key, trie) => {
    callbackArgs.push([value, key]);
    if (value > 0 && value < 3) {
      // Should be visited because it is higher alphabetically
      trie.set(`${key}N`, value + 1);
    }

    if (key === "b") {
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
      [2, "aab"],
      [3, "aabN"],
      [3, "aac"],
      [4, "b"]
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
    ["b", 4],
    ["a", 1],
    ["aac", 3],
    ["aab", 2]
  ]);
  const callbackArgs = [];
  trie.forEach((value, key, trie) => {
    callbackArgs.push([value, key]);
    trie.delete("b");
  });
  deepEqual(
    callbackArgs,
    [[0, ""], [1, "a"], [2, "aab"], [3, "aac"]],
    "keys deleted after forEach begins and before being visited are not visited"
  );
  end();
});

test("trie-mapping forEach() with thisArg", ({ deepEqual, end }) => {
  const trie = trieMapping([
    ["", 0],
    ["b", 4],
    ["a", 1],
    ["aac", 3],
    ["aab", 2]
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
      [2, "aab", trie],
      [3, "aac", trie],
      [4, "b", trie]
    ],
    "callbackfn is bound to thisArg"
  );
  end();
});

test("trie-mapping get() with a key that does not exist", ({ equal, end }) => {
  equal(trieMapping().get(), undefined);
  equal(trieMapping().get(""), undefined);
  equal(trieMapping().get("hello"), undefined);
  equal(trieMapping([["hey", 0]]).get("hello"), undefined);
  equal(trieMapping([["he", 0]]).get("hello"), undefined);
  equal(trieMapping([["hello", 0]]).get("he"), undefined);
  equal(trieMapping([["hello", 0]]).get("hey"), undefined);
  equal(trieMapping([["hell", 0]]).get("hello"), undefined);
  equal(trieMapping([["hello", 0]]).get("hell"), undefined);
  equal(trieMapping([["hello", 0]]).get("hells"), undefined);
  end();
});

test("trie-mapping get() with a key that exists", ({ equal, end }) => {
  equal(trieMapping([[undefined, 0]]).get(), 0);
  equal(trieMapping([["", 0]]).get(""), 0);
  equal(trieMapping([["hello", 0]]).get("hello"), 0);
  equal(trieMapping([["hello", 0], ["hey", 1]]).get("hello"), 0);
  equal(trieMapping([["hello", 1], ["hell", 0]]).get("hell"), 0);
  equal(trieMapping([["hello", 1], ["hell", 0]]).get("hello"), 1);
  equal(trieMapping([["hello", 1], ["hells", 0]]).get("hells"), 0);
  equal(trieMapping([["hello", 0], ["hello man", 1]]).get("hello"), 0);
  end();
});

test("trie-mapping getPrefixesOf() with a string with existing prefixes", ({
  deepEqual,
  end
}) => {
  deepEqual(trieMapping().getPrefixesOf(), []);
  deepEqual(trieMapping().getPrefixesOf(""), []);
  deepEqual(trieMapping().getPrefixesOf("hello"), []);
  deepEqual(trieMapping([["hey", 0]]).getPrefixesOf("hello"), []);
  deepEqual(trieMapping([["hello", 0]]).getPrefixesOf("hells"), []);
  deepEqual(trieMapping([["hello", 0]]).getPrefixesOf("hell"), []);
  end();
});

test("trie-mapping getPrefixesOf() with a string with no existing prefixes", ({
  deepEqual,
  end
}) => {
  deepEqual(trieMapping([["", 0]]).getPrefixesOf(), [["", 0]]);
  deepEqual(trieMapping([["", 0]]).getPrefixesOf(""), [["", 0]]);
  deepEqual(trieMapping([["hello", 0]]).getPrefixesOf("hello"), [["hello", 0]]);
  deepEqual(trieMapping([["hello", 1], ["hey", 1]]).getPrefixesOf("hello"), [
    ["hello", 1]
  ]);
  deepEqual(
    trieMapping([["hey man", 0], ["hey", 1]]).getPrefixesOf("hey man"),
    [["hey", 1], ["hey man", 0]]
  );
  deepEqual(
    trieMapping([["hello"], ["hells"], ["hell"]]).getPrefixesOf("hello"),
    [["hell", undefined], ["hello", undefined]]
  );
  deepEqual(
    trieMapping([["", 0], ["hey man", 2], ["hey", 1]]).getPrefixesOf("hey man"),
    [["", 0], ["hey", 1], ["hey man", 2]]
  );
  deepEqual(
    trieMapping([
      ["hello Newman", 2],
      ["hello", 0],
      ["hello New", 1]
    ]).getPrefixesOf("hello Newman"),
    [["hello", 0], ["hello New", 1], ["hello Newman", 2]]
  );
  deepEqual(
    trieMapping([
      ["he", 1],
      ["hey", 5],
      ["hells", 4],
      ["hello", 3],
      ["hell", 2],
      ["bye", 0]
    ]).getPrefixesOf("hello"),
    [["he", 1], ["hell", 2], ["hello", 3]]
  );
  end();
});

test("trie-mapping getPrefixedWith() with a prefix that does not exist", ({
  deepEqual,
  end
}) => {
  deepEqual(trieMapping().getPrefixedWith(), []);
  deepEqual(trieMapping().getPrefixedWith(""), []);
  deepEqual(trieMapping().getPrefixedWith("hello"), []);
  deepEqual(trieMapping([["hey", 0]]).getPrefixedWith("hello"), []);
  deepEqual(trieMapping([["hello", 0]]).getPrefixedWith("hey"), []);
  deepEqual(trieMapping([["hells", 0]]).getPrefixedWith("hello"), []);
  deepEqual(trieMapping([["hell", 0]]).getPrefixedWith("hello"), []);
  end();
});

test("trie-mapping getPrefixedWith() with a prefix that exists", ({
  deepEqual,
  end
}) => {
  deepEqual(trieMapping([["", 0]]).getPrefixedWith(), [["", 0]]);
  deepEqual(trieMapping([["", 0]]).getPrefixedWith(""), [["", 0]]);
  deepEqual(trieMapping([["", 0], ["h", 1], ["hey", 2]]).getPrefixedWith(""), [
    ["", 0],
    ["h", 1],
    ["hey", 2]
  ]);
  deepEqual(trieMapping([["hello", 0], ["hey", 1]]).getPrefixedWith("hello"), [
    ["hello", 0]
  ]);
  deepEqual(trieMapping([["hells", 1], ["hello", 0]]).getPrefixedWith("hell"), [
    ["hello", 0],
    ["hells", 1]
  ]);
  deepEqual(
    trieMapping([["hello"], ["hells"], ["hell"]]).getPrefixedWith("hell"),
    [["hell", undefined], ["hello", undefined], ["hells", undefined]]
  );
  deepEqual(
    trieMapping([
      ["hello Newman", 2],
      ["hello", 1],
      ["Newman!", 0]
    ]).getPrefixedWith("hello Newman"),
    [["hello Newman", 2]]
  );
  deepEqual(
    trieMapping([
      ["he", 1],
      ["hey", 5],
      ["hells", 4],
      ["hello", 3],
      ["hell", 2],
      ["bye", 0]
    ]).getPrefixedWith("hell"),
    [["hell", 2], ["hello", 3], ["hells", 4]]
  );
  end();
});

test("trie-mapping has() with a key that does not exist", ({ equal, end }) => {
  equal(trieMapping().has(), false);
  equal(trieMapping().has(""), false);
  equal(trieMapping().has("hello"), false);
  equal(trieMapping([["hey"]]).has("hello"), false);
  equal(trieMapping([["hello"]]).has("hey"), false);
  equal(trieMapping([["hell"]]).has("hello"), false);
  equal(trieMapping([["hello"]]).has("hell"), false);
  end();
});

test("trie-mapping has() with a key that exists", ({ equal, end }) => {
  equal(trieMapping([[]]).has(), true);
  equal(trieMapping([[""]]).has(""), true);
  equal(trieMapping([["hello"]]).has("hello"), true);
  equal(trieMapping([["hello"], ["hey"]]).has("hello"), true);
  equal(trieMapping([["hello man"], ["hello"]]).has("hello"), true);
  equal(trieMapping([["hello man"], ["hello"], ["man!"]]).has("hello"), true);
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
        ["b", 4],
        ["a", 1],
        ["aac", 3],
        ["aab", 2]
      ]).keys()
    ],
    ["", "a", "aab", "aac", "b"]
  );
  end();
});

test("trie-mapping set() with undefined as key", ({ equal, end }) => {
  const trie = trieMapping().set(undefined, 0);
  equal(trie.has(), true);
  equal(trie.get(), 0);
  equal(trie.size, 1);
  equal(trie.set(undefined).size, 1);
  equal(trie.delete(), true);
  end();
});

test("trie-mapping set() with an empty key", ({ equal, end }) => {
  const trie = trieMapping().set("", 0);
  equal(trie.has(""), true);
  equal(trie.get(""), 0);
  equal(trie.size, 1);
  equal(trie.set("").size, 1);
  equal(trie.delete(""), true);
  end();
});

test("trie-mapping set() with an empty trie", ({ equal, end }) => {
  const trie = trieMapping().set("hi", 0);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.size, 1);
  equal(trie.set("hi").size, 1);
  equal(trie.delete("hi"), true);
  end();
});

test("trie-mapping set() with a non-empty trie", ({ equal, end }) => {
  const trie = trieMapping([["hey", 1], ["hello", 2]]).set("hi", 0);
  equal(trie.has("hi"), true);
  equal(trie.get("hi"), 0);
  equal(trie.size, 3);
  equal(trie.set("hi").size, 3);
  equal(trie.delete("hi"), true);
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
        ["b", 4],
        ["a", 1],
        ["aac", 3],
        ["aab", 2]
      ]).values()
    ],
    [0, 1, 2, 3, 4]
  );
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
    [...trieMapping([["", 0], ["b", 4], ["a", 1], ["aac", 3], ["aab", 2]])],
    [["", 0], ["a", 1], ["aab", 2], ["aac", 3], ["b", 4]]
  );
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
  const trie = trieMapping([["hi", 0], ["hey", 1]]);
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
