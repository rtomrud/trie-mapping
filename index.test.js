import trieMapping from "./index.js";

test("trie-mapping with an invalid argument", () => {
  expect(() => trieMapping(false)).toThrowError(TypeError);
  expect(() => trieMapping(0)).toThrowError(TypeError);
  expect(() => trieMapping("")).toThrowError(TypeError);
  expect(() => trieMapping(() => {})).toThrowError(TypeError);
});

test("trie-mapping with no elements", () => {
  expect(trieMapping().root).toEqual({});
  expect(trieMapping(null).root).toEqual({});
  expect(trieMapping([]).root).toEqual({});
  expect(trieMapping({}).root).toEqual({});
});

test("trie-mapping with an array of arrays", () => {
  expect(
    trieMapping([
      ["hey", 0],
      ["hi", 1],
    ]).root
  ).toEqual({ h: { ey: { "": 0 }, i: { "": 1 } } });
  expect(
    trieMapping([
      ["hey", 0],
      ["hi", 1],
      ["hey", 2],
    ]).root
  ).toEqual({ h: { ey: { "": 2 }, i: { "": 1 } } });
});

test("trie-mapping with an array of objects", () => {
  expect(
    trieMapping([
      { 0: "hey", 1: 0 },
      { 0: "hi", 1: 1 },
    ]).root
  ).toEqual({ h: { ey: { "": 0 }, i: { "": 1 } } });
  expect(
    trieMapping([
      { 0: "hey", 1: 0 },
      { 0: "hi", 1: 1 },
      { 0: "hey", 1: 2 },
    ]).root
  ).toEqual({ h: { ey: { "": 2 }, i: { "": 1 } } });
});

test("trie-mapping with a native iterable", () => {
  expect(
    trieMapping(
      new Map([
        ["hey", 0],
        ["hi", 1],
      ])
    ).root
  ).toEqual({ h: { ey: { "": 0 }, i: { "": 1 } } });
});

test("trie-mapping with an invalid custom iterable", () => {
  expect(() => trieMapping({ [Symbol.iterator]: undefined })).toThrowError(
    TypeError
  );
  expect(() =>
    trieMapping({
      [Symbol.iterator]() {
        return {};
      },
    })
  ).toThrowError(TypeError);
  expect(() =>
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
    })
  ).toThrowError(TypeError);
});

test("trie-mapping with a valid custom iterable", () => {
  expect(
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
    }).root
  ).toEqual({ h: { ey: { "": 0 }, i: { "": 1 } } });
});

test("trie-mapping with a trie's root object", () => {
  expect(trieMapping({ h: { ey: { "": 0 }, i: { "": 1 } } }).root).toEqual({
    h: { ey: { "": 0 }, i: { "": 1 } },
  });
});

test("trie-mapping size with an empty trie", () => {
  expect(trieMapping().size).toBe(0);
  expect(trieMapping(null).size).toBe(0);
  expect(trieMapping([]).size).toBe(0);
  expect(trieMapping({}).size).toBe(0);
});

test("trie-mapping size with a non-empty trie", () => {
  expect(trieMapping([["hi", 0]]).size).toBe(1);
  expect(trieMapping([["hi"]]).size).toBe(1);
  expect(
    trieMapping([
      ["hi", 0],
      ["hey", 1],
    ]).size
  ).toBe(2);
  expect(trieMapping([["hi"], ["hey"]]).size).toBe(2);
  expect(trieMapping([["hi", 0]]).size).toBe(1);
  expect(trieMapping([["hi"]]).size).toBe(1);
  expect(
    trieMapping([
      ["hi", 0],
      ["hey", 1],
    ]).size
  ).toBe(2);
  expect(trieMapping([["hi"], ["hey"]]).size).toBe(2);
  expect(trieMapping({ "": 0 }).size).toBe(1);
  expect(trieMapping({ h: { i: { "": 0 } }, ey: { "": 1 } }).size).toBe(2);
});

test("trie-mapping root with an empty trie", () => {
  expect(trieMapping().root).toEqual({});
  expect(trieMapping(null).root).toEqual({});
  expect(trieMapping([]).root).toEqual({});
  expect(trieMapping({}).root).toEqual({});
});

test("trie-mapping root with a non-empty trie", () => {
  expect(
    trieMapping([
      ["he", 1],
      ["hey", 5],
      ["hells", 4],
      ["hello", 3],
      ["hell", 2],
      ["bye", 0],
    ]).root
  ).toEqual({
    he: { "": 1, y: { "": 5 }, ll: { s: { "": 4 }, o: { "": 3 }, "": 2 } },
    bye: { "": 0 },
  });
  expect(
    trieMapping([
      ["h", 0],
      ["he", 1],
      ["hello", 2],
      ["hey", 3],
    ]).root
  ).toEqual({ h: { "": 0, e: { "": 1, llo: { "": 2 }, y: { "": 3 } } } });
});

test("trie-mapping clear() with an empty trie", () => {
  const trie = trieMapping();
  expect(trie.clear()).toBe(undefined);
  expect(trie.root).toEqual({});
});

test("trie-mapping clear() with a non-empty trie", () => {
  const trie = trieMapping([
    ["hi", 1],
    ["hey", 0],
  ]);
  expect(trie.clear()).toBe(undefined);
  expect(trie.root).toEqual({});
});

test("trie-mapping delete() with a key that does not exist", () => {
  const emptyString = trieMapping();
  expect(emptyString.delete("")).toBe(false);
  expect(emptyString.root).toEqual({});
  const oneLetter = trieMapping();
  expect(oneLetter.delete("h")).toBe(false);
  expect(oneLetter.root).toEqual({});
  const oneLetterMore = trieMapping([["hell", 0]]);
  expect(oneLetterMore.delete("hello")).toBe(false);
  expect(oneLetterMore.root).toEqual({ hell: { "": 0 } });
  const manyLettersMore = trieMapping([["he", 0]]);
  expect(manyLettersMore.delete("hello")).toBe(false);
  expect(manyLettersMore.root).toEqual({ he: { "": 0 } });
  const oneLetterLess = trieMapping([["hello", 0]]);
  expect(oneLetterLess.delete("hell")).toBe(false);
  expect(oneLetterLess.root).toEqual({ hello: { "": 0 } });
  const manyLettersLess = trieMapping([["hello", 0]]);
  expect(manyLettersLess.delete("he")).toBe(false);
  expect(manyLettersLess.root).toEqual({ hello: { "": 0 } });
  const oneDifferentLetter = trieMapping([["hello", 0]]);
  expect(oneDifferentLetter.delete("hells")).toBe(false);
  expect(oneDifferentLetter.root).toEqual({ hello: { "": 0 } });
  const manyDifferentLetters = trieMapping([["hello", 0]]);
  expect(manyDifferentLetters.delete("helio")).toBe(false);
  expect(manyDifferentLetters.root).toEqual({ hello: { "": 0 } });
});

test("trie-mapping delete() with a key that exists", () => {
  const emptyString = trieMapping([["", undefined]]);
  expect(emptyString.delete("")).toBe(true);
  expect(emptyString.root).toEqual({});
  const noSiblings = trieMapping([["h", 0]]);
  expect(noSiblings.delete("h")).toBe(true);
  expect(noSiblings.root).toEqual({});
  const oneSibling = trieMapping([
    ["him", 0],
    ["his", 1],
  ]);
  expect(oneSibling.delete("his")).toBe(true);
  expect(oneSibling.root).toEqual({ him: { "": 0 } });
  const onlyEmptyStringSibling = trieMapping([
    ["hi", 0],
    ["his", 1],
  ]);
  expect(onlyEmptyStringSibling.delete("his")).toBe(true);
  expect(onlyEmptyStringSibling.root).toEqual({ hi: { "": 0 } });
  const manySiblings = trieMapping([
    ["hi", 1],
    ["him", 2],
    ["his", 3],
  ]);
  expect(manySiblings.delete("his")).toBe(true);
  expect(manySiblings.root).toEqual({ hi: { "": 1, m: { "": 2 } } });
  const noSuccessors = trieMapping([
    ["hi", 0],
    ["bye", 1],
  ]);
  expect(noSuccessors.delete("bye")).toBe(true);
  expect(noSuccessors.root).toEqual({ hi: { "": 0 } });
  const oneSuccessor = trieMapping([
    ["hi", 1],
    ["his", 2],
  ]);
  expect(oneSuccessor.delete("hi")).toBe(true);
  expect(oneSuccessor.root).toEqual({ his: { "": 2 } });
  const manySuccessors = trieMapping([
    ["hi", 1],
    ["him", 2],
    ["his", 3],
  ]);
  expect(manySuccessors.delete("hi")).toBe(true);
  expect(manySuccessors.root).toEqual({ hi: { m: { "": 2 }, s: { "": 3 } } });
});

test("trie-mapping delete() with a key that exists (repeatedly)", () => {
  const trie = trieMapping([["hi", 1]]);
  expect(trie.delete("hi")).toBe(true);
  expect(trie.delete("hi")).toBe(false);
});

test("trie-mapping entries() with Symbol.iterator", () => {
  const iterator = trieMapping().entries();
  expect(typeof iterator[Symbol.iterator]).toBe("function");
  expect(iterator).toBe(iterator[Symbol.iterator]());
});

test("trie-mapping entries() with an empty trie", () => {
  expect([...trieMapping().entries()]).toEqual([]);
  expect([...trieMapping(Object.create({ hi: 0 })).entries()]).toEqual([]);

  const iterator = trieMapping().entries();
  expect(iterator.next() && iterator.next()).toEqual({
    done: true,
    value: undefined,
  });
});

test("trie-mapping entries() with a non-empty trie", () => {
  expect([
    ...trieMapping([
      ["", 0],
      ["a", 1],
      ["aac", 4],
      ["aaa", 2],
      ["aab", 3],
    ]).entries(),
  ]).toEqual([
    ["", 0],
    ["a", 1],
    ["aaa", 2],
    ["aab", 3],
    ["aac", 4],
  ]);
  expect([
    ...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).entries(),
  ]).toEqual([
    ["", 1],
    ["llo", 2],
    ["y", 3],
  ]);
  expect([
    ...trieMapping({
      "": 0,
      e: { "": 1, llo: { "": 2 }, y: { "": 3 } },
    }).entries(),
  ]).toEqual([
    ["", 0],
    ["e", 1],
    ["ello", 2],
    ["ey", 3],
  ]);
  expect([
    ...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).entries(),
  ]).toEqual([
    ["", 1],
    ["llo", 2],
    ["y", 3],
  ]);
});

test("trie-mapping entries() with clear() while suspended", () => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0],
  ]);
  const iterator1 = trie.entries();
  const iterator2 = trie.entries();
  expect(iterator1.next()).toEqual({ done: false, value: ["hello", 0] });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  expect(iterator1.next()).toEqual({ done: false, value: ["hey", 1] });
  expect(iterator1.next()).toEqual({ done: true, value: undefined });
  expect(iterator2.next()).toEqual({ done: false, value: ["he", 0] });
  expect(iterator2.next()).toEqual({ done: false, value: ["hey", 1] });
  expect(iterator2.next()).toEqual({ done: true, value: undefined });
});

test("trie-mapping forEach() with an empty trie", () => {
  let wasCalledOnEmptyTrie = false;
  trieMapping().forEach(() => {
    wasCalledOnEmptyTrie = true;
  });
  expect(wasCalledOnEmptyTrie).toEqual(false);
  let wasCalledOnNonEmptyPrototype = false;
  trieMapping(Object.create({ hi: 0 })).forEach(() => {
    wasCalledOnNonEmptyPrototype = true;
  });
  expect(wasCalledOnNonEmptyPrototype).toEqual(false);
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
  expect(callbackArgs).toEqual([
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
  expect(callbackArgs).toEqual([
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
  expect(callbackArgs).toEqual([
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
  expect(store.items).toEqual([
    [0, "", trie],
    [1, "a", trie],
    [2, "aa", trie],
    [3, "ab", trie],
  ]);
});

test("trie-mapping get() with a key that does not exist", () => {
  expect(trieMapping().get(1)).toBe(undefined);
  expect(trieMapping().get("")).toBe(undefined);
  expect(trieMapping().get("hello")).toBe(undefined);
  expect(trieMapping([["hello", 0]]).get("he")).toBe(undefined);
  expect(trieMapping([["hello", 0]]).get("hell")).toBe(undefined);
  expect(trieMapping([["hello", 0]]).get("hey")).toBe(undefined);
  expect(trieMapping([["he", 0]]).get("hello")).toBe(undefined);
  expect(trieMapping([["hell", 0]]).get("hello")).toBe(undefined);
  expect(trieMapping([["hey", 0]]).get("hello")).toBe(undefined);
  expect(trieMapping([["hello", 0]]).get("hells")).toBe(undefined);
});

test("trie-mapping get() with a key that exists", () => {
  expect(trieMapping([[1, 0]]).get(1)).toBe(0);
  expect(trieMapping([["", undefined]]).get("")).toBe(undefined);
  expect(trieMapping([["hello", 0]]).get("hello")).toBe(0);
  expect(
    trieMapping([
      ["hello", 1],
      ["he", 0],
    ]).get("he")
  ).toBe(0);
  expect(
    trieMapping([
      ["hello", 1],
      ["hell", 0],
    ]).get("hell")
  ).toBe(0);
  expect(
    trieMapping([
      ["hello", 0],
      ["hey", 1],
    ]).get("hey")
  ).toBe(1);
  expect(
    trieMapping([
      ["hello", 1],
      ["he", 0],
    ]).get("hello")
  ).toBe(1);
  expect(
    trieMapping([
      ["hello", 1],
      ["hell", 0],
    ]).get("hello")
  ).toBe(1);
  expect(
    trieMapping([
      ["hello", 0],
      ["hey", 1],
    ]).get("hello")
  ).toBe(0);
  expect(
    trieMapping([
      ["hello", 0],
      ["hells", 1],
    ]).get("hells")
  ).toBe(1);
});

test("trie-mapping has() with a key that does not exist", () => {
  expect(trieMapping().has(1)).toBe(false);
  expect(trieMapping().has("")).toBe(false);
  expect(trieMapping([["hey"]]).has("hello")).toBe(false);
  expect(trieMapping([["hello"]]).has("hey")).toBe(false);
  expect(trieMapping([["hell"]]).has("hello")).toBe(false);
  expect(trieMapping([["hello"]]).has("hell")).toBe(false);
});

test("trie-mapping has() with a key that exists", () => {
  expect(trieMapping([["1", 0]]).has(1)).toBe(true);
  expect(trieMapping([["", undefined]]).has("")).toBe(true);
  expect(
    trieMapping([
      ["hello", 1],
      ["hey", 0],
    ]).has("hello")
  ).toBe(true);
  expect(
    trieMapping([
      ["hey", 0],
      ["hello", 1],
    ]).has("hey")
  ).toBe(true);
  expect(
    trieMapping([
      ["hello", 0],
      ["hell", 1],
    ]).has("hello")
  ).toBe(true);
  expect(
    trieMapping([
      ["hell", 0],
      ["hello", 1],
    ]).has("hell")
  ).toBe(true);
});

test("trie-mapping keys() with Symbol.iterator", () => {
  const iterator = trieMapping().keys();
  expect(typeof iterator[Symbol.iterator]).toBe("function");
  expect(iterator).toBe(iterator[Symbol.iterator]());
});

test("trie-mapping keys() with an empty trie", () => {
  expect([...trieMapping().keys()]).toEqual([]);
  expect([...trieMapping(Object.create({ hi: 0 })).keys()]).toEqual([]);
  const iterator = trieMapping().keys();
  expect(iterator.next() && iterator.next()).toEqual({
    done: true,
    value: undefined,
  });
});

test("trie-mapping keys() with a non-empty trie", () => {
  expect([
    ...trieMapping([
      ["", 0],
      ["a", 1],
      ["aac", 4],
      ["aaa", 2],
      ["aab", 3],
    ]).keys(),
  ]).toEqual(["", "a", "aaa", "aab", "aac"]);
  expect([
    ...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).keys(),
  ]).toEqual(["", "llo", "y"]);
});

test("trie-mapping keys() with clear() while suspended", () => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0],
  ]);
  const iterator1 = trie.keys();
  const iterator2 = trie.keys();
  expect(iterator1.next()).toEqual({ done: false, value: "hello" });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  expect(iterator1.next()).toEqual({ done: false, value: "hey" });
  expect(iterator1.next()).toEqual({ done: true, value: undefined });
  expect(iterator2.next()).toEqual({ done: false, value: "he" });
  expect(iterator2.next()).toEqual({ done: false, value: "hey" });
  expect(iterator2.next()).toEqual({ done: true, value: undefined });
});

test("trie-mapping set() with a key that does not exist", () => {
  expect(trieMapping().set(1, 0).root).toEqual({ 1: { "": 0 } });
  expect(trieMapping().set("", undefined).root).toEqual({ "": undefined });
  expect(trieMapping().set("hi", 0).root).toEqual({ hi: { "": 0 } });
  expect(
    trieMapping([
      ["hey", 0],
      ["hello", 1],
    ]).set("hi", 2).root
  ).toEqual({ h: { e: { y: { "": 0 }, llo: { "": 1 } }, i: { "": 2 } } });
  expect(
    trieMapping([
      ["hey", 0],
      ["hello", 1],
    ]).set("hell", 2).root
  ).toEqual({ he: { y: { "": 0 }, ll: { o: { "": 1 }, "": 2 } } });
  expect(
    trieMapping([
      ["hey", 0],
      ["hello", 1],
    ]).set("hells", 2).root
  ).toEqual({ he: { y: { "": 0 }, ll: { o: { "": 1 }, s: { "": 2 } } } });
});

test("trie-mapping set() with a key that exists", () => {
  expect(trieMapping([["1", 0]]).set(1, 1).root).toEqual({ 1: { "": 1 } });
  expect(trieMapping([["", undefined]]).set("", null).root).toEqual({
    "": null,
  });
  expect(trieMapping([["hi", 0]]).set("hi", 1).root).toEqual({ hi: { "": 1 } });
  expect(
    trieMapping([
      ["", 0],
      ["hey", 1],
    ]).set("", 2).root
  ).toEqual({ "": 2, hey: { "": 1 } });
  expect(
    trieMapping([
      ["he", 0],
      ["hey", 1],
    ]).set("he", 2).root
  ).toEqual({ he: { "": 2, y: { "": 1 } } });
  expect(
    trieMapping([
      ["he", 0],
      ["hey", 1],
    ]).set("hey", 2).root
  ).toEqual({ he: { "": 0, y: { "": 2 } } });
});

test("trie-mapping values() with Symbol.iterator", () => {
  const iterator = trieMapping().values();
  expect(typeof iterator[Symbol.iterator]).toBe("function");
  expect(iterator).toBe(iterator[Symbol.iterator]());
});

test("trie-mapping values() with an empty trie", () => {
  expect([...trieMapping().values()]).toEqual([]);
  expect([...trieMapping(Object.create({ hi: 0 })).values()]).toEqual([]);
  const iterator = trieMapping().values();
  expect(iterator.next() && iterator.next()).toEqual({
    done: true,
    value: undefined,
  });
});

test("trie-mapping values() with a non-empty trie", () => {
  expect([
    ...trieMapping([
      ["", 0],
      ["a", 1],
      ["aac", 4],
      ["aaa", 2],
      ["aab", 3],
    ]).values(),
  ]).toEqual([0, 1, 2, 3, 4]);
  expect([
    ...trieMapping({ "": 1, llo: { "": 2 }, y: { "": 3 } }).values(),
  ]).toEqual([1, 2, 3]);
});

test("trie-mapping values() with clear() while suspended", () => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0],
  ]);
  const iterator1 = trie.values();
  const iterator2 = trie.values();
  expect(iterator1.next()).toEqual({ done: false, value: 0 });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  expect(iterator1.next()).toEqual({ done: false, value: 1 });
  expect(iterator1.next()).toEqual({ done: true, value: undefined });
  expect(iterator2.next()).toEqual({ done: false, value: 0 });
  expect(iterator2.next()).toEqual({ done: false, value: 1 });
  expect(iterator2.next()).toEqual({ done: true, value: undefined });
});

test("trie-mapping [@@iterator]() with Symbol.iterator", () => {
  const iterator = trieMapping()[Symbol.iterator]();
  expect(typeof iterator[Symbol.iterator]).toBe("function");
  expect(iterator).toBe(iterator[Symbol.iterator]());
});

test("trie-mapping [@@iterator]() with an empty trie", () => {
  expect([...trieMapping()]).toEqual([]);
  expect([...trieMapping(Object.create({ hi: 0 }))]).toEqual([]);
  const iterator = trieMapping()[Symbol.iterator]();
  expect(iterator.next() && iterator.next()).toEqual({
    done: true,
    value: undefined,
  });
});

test("trie-mapping [@@iterator]() with a non-empty trie", () => {
  expect([
    ...trieMapping([
      ["", 0],
      ["a", 1],
      ["aac", 4],
      ["aaa", 2],
      ["aab", 3],
    ]),
  ]).toEqual([
    ["", 0],
    ["a", 1],
    ["aaa", 2],
    ["aab", 3],
    ["aac", 4],
  ]);
});

test("trie-mapping [@@iterator]() with clear() while suspended", () => {
  const trie = trieMapping([
    ["hi", 2],
    ["hello", 0],
  ]);
  const iterator1 = trie[Symbol.iterator]();
  const iterator2 = trie[Symbol.iterator]();
  expect(iterator1.next()).toEqual({ done: false, value: ["hello", 0] });
  trie.clear();
  trie.set("he", 0);
  trie.set("hey", 1);
  expect(iterator1.next()).toEqual({ done: false, value: ["hey", 1] });
  expect(iterator1.next()).toEqual({ done: true, value: undefined });
  expect(iterator2.next()).toEqual({ done: false, value: ["he", 0] });
  expect(iterator2.next()).toEqual({ done: false, value: ["hey", 1] });
  expect(iterator2.next()).toEqual({ done: true, value: undefined });
});

test("trie-mapping with missing Symbol.iterator", () => {
  const symbol = Symbol;
  Symbol = undefined;
  const trie = trieMapping([
    ["hi", 0],
    ["hey", 1],
  ]);
  expect(() => [...trie.keys()]).toThrow();
  expect(() => [...trie.entries()]).toThrow();
  expect(() => [...trie.values()]).toThrow();
  Symbol = symbol;
});
