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
// cheat parse w/ eval
const comps = pairs.map((line) => line.split("\n").map((pkt) => eval(pkt)));

function compare(left, right) {
  // if both values are integers
  if (typeof left === "number" && typeof right === "number") {
    if (left < right) return 1; // valid
    else if (left > right) return -1; // invalid
    return 0;
  }
  // if exactly one is an integer
  if (typeof left === "number" && typeof right === "object") {
    left = [left];
  } else if (typeof left === "object" && typeof right === "number") {
    right = [right];
  }

  // both values are lists
  if (typeof left === "object" && typeof right === "object") {
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
      const result = compare(left[i], right[i]);
      if (result !== 0) return result;
    }
    // left ran out of values, valid
    if (right.length > left.length) return 1;
    // right ran out of values, invalid
    else if (left.length > right.length) return -1;
  }

  // same
  return 0;
}

// part1 add indices (start at 1) of pairs in the right order
let part1 = comps.reduce((acc, [left, right], idx) => {
  return acc + (compare(left, right) > 0 ? idx + 1 : 0);
}, 0);

console.log("#1:", part1);

// part2 sort all packets including divider packets
let messages = comps.flat();
messages.push([[2]]);
messages.push([[6]]);

messages.sort((a, b) => compare(b, a));

// find divider packets (1-indexed) and multiply locations
let part2 = 1;
messages.forEach((val, idx) => {
  if (
    typeof val == "object" &&
    val.length == 1 &&
    val[0].length == 1 &&
    (val[0][0] == 2 || val[0][0] == 6)
  )
    part2 *= idx + 1;
});
console.log("#2:", part2);
