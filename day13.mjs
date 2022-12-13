import { promises } from "fs";

const sample = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

let puzzle = sample;
const dataBuf = await promises.readFile("input13");
puzzle = dataBuf.toString();
const pairs = puzzle.split("\n\n").filter((line) => Boolean(line));

// replaces cheat parse w/ JSON.parse (instead of eval)
const parseList = (input) => {
  const list = [];

  let queue = input.substring(1, input.length - 1).split("");
  while (queue.length > 0) {
    const cur = queue.shift();
    if (isFinite(cur)) {
      // number
      let num = cur;
      while (isFinite(queue[0])) {
        num += queue.shift();
      }
      list.push(Number(num));
    } else if (cur === "[") {
      // construct sublist, parse recursively
      let subList = cur;
      let deep = 1;
      while (deep > 0) {
        const more = queue.shift();
        if (more === "[") deep++;
        if (more === "]") deep--;
        subList += more;
      }
      list.push(parseList(subList));
    } // else console.assert(cur === ",");
  }
  return list;
};

const comps = pairs.map((line) =>
  line
    .split("\n")
    .filter((line) => Boolean(line)) // blank line at end
    .map((pkt) => parseList(pkt))
);

function compare(left, right) {
  // if both values are integers
  if (typeof left === "number" && typeof right === "number")
    return right - left;

  // if exactly one is an integer
  if (typeof left === "number" && typeof right === "object") {
    left = [left];
  } else if (typeof left === "object" && typeof right === "number") {
    right = [right];
  }

  // both values are lists
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const result = compare(left[i], right[i]);
    if (result !== 0) return result;
  }
  // ran out of values
  return right.length - left.length;
}

// part1 add indices (start at 1) of pairs in the right order
let part1 = comps.reduce((acc, [left, right], idx) => {
  return acc + (compare(left, right) > 0 ? idx + 1 : 0);
}, 0);

console.log("#1:", part1);

// part2 sort all packets including divider packets
let messages = comps.flat();
const divider = [[[2]], [[6]]];
messages.push(...divider);

messages.sort((a, b) => compare(b, a));

// find divider packets (1-indexed) and multiply locations
const part2 = divider.reduce(
  (acc, cur) => acc * (messages.indexOf(cur) + 1),
  1
);
console.log("#2:", part2);
