import { promises } from "fs";

const sample = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

let puzzle = sample;
const dataBuf = await promises.readFile("input3");
puzzle = dataBuf.toString();
const sacks = puzzle.split("\n").filter((line) => Boolean(line));

function score(c) {
  let code = c.charCodeAt() - "a".charCodeAt() + 1;
  if (code < 1) {
    code = c.charCodeAt() - "A".charCodeAt() + 27;
  }
  return code;
}

const part1 = sacks
  .map((sack) => {
    // split first half of string into char array, and filter if in second half.
    const foo = [...sack.slice(0, sack.length / 2)]
      .filter((c) => new Set(sack.slice(sack.length / 2)).has(c))
      .pop();
    return score(foo);
  })
  .reduce((a, b) => a + b);

console.log("#1", part1);

let part2 = 0;
// I don't know how to functionally partition.
for (let i = 0; i < sacks.length; i += 3) {
  const group = sacks.slice(i, i + 3).map((a) => new Set(a));

  for (const c of group[0]) {
    if (group[1].has(c) && group[2].has(c)) {
      part2 += score(c);
      break;
    }
  }
}

console.log("#2", part2);
