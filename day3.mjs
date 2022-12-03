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
const sacks = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .map((sack) => [sack.slice(0, sack.length / 2), sack.slice(sack.length / 2)]);

function score(foo) {
  let code = foo.charCodeAt(0) - "a".charCodeAt() + 1;
  if (code < 1) {
    code = foo.charCodeAt(0) - "A".charCodeAt() + 27;
  }
  // console.log(foo, code);
  return code;
}

const part1 = sacks
  .map((sack) => {
    const foo = sack[0]
      .split("")
      .filter((c) => sack[1].indexOf(c) != -1)
      .pop();
    return score(foo);
  })
  .reduce((a, b) => a + b);

//console.log(sacks);

console.log();
console.log("#1", part1);

let part2 = 0;
for (let i = 0; i < sacks.length; i += 3) {
  const group = sacks.slice(i, i + 3).map((h) => h.join(""));
  //console.log(group);
  for (const c of group[0].split("")) {
    if (group[1].indexOf(c) != -1 && group[2].indexOf(c) != -1) {
      //console.log(c);
      part2 += score(c);
      break;
    }
  }
}

console.log("#2", part2);
