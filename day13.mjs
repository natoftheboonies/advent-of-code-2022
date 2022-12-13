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
  console.log("Compare", left, "vs", right);
  // if both values are integers
  if (typeof left === "number" && typeof right === "number") {
    if (left < right) {
      console.log("Left side is smaller"); // good
      return 1;
    } else if (left > right) {
      console.log("Left side is larger"); // bad
      return -1;
    }
    //console.log('same');
    return 0;
  }
  // if exactly one is an integer
  if (typeof left === "number" && typeof right === "object") {
    console.log("upgrading left", left);
    left = [left];
  } else if (typeof left === "object" && typeof right === "number") {
    console.log("upgrading right", right);
    right = [right];
  }

  // both values are lists
  if (typeof left === "object" && typeof right === "object") {
    console.log("begin list", left, "-vs-", right);
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
      console.log("loop", left, "vs", right, "idx", i);
      const result = compare(left[i], right[i]);
      if (result != 0) {
        return result;
      }
    }
    // left ran out of values, good
    if (right.length > left.length) {
      console.log("left ran out of items");
      return 1;
    }
    // right ran out of values, bad
    else if (left.length > right.length) {
      console.log("right ran out of items");
      return -1;
    }
  }
  // same
  return 0;
}

//console.assert(compare([1,1,3,1,1], [1,1,5,1,1]) == 1)
//console.assert(compare([[1],[2,3,4]],[[1],4]) == 1)
//console.assert(compare([9],[[8,7,6]]) == -1)
//console.assert(compare([[4,4],4,4],[[4,4],4,4,4]) == 1);
//console.assert(compare([7,7,7,7],[7,7,7]) == -1);
//console.assert(compare([],[3]) == 1);
//console.assert(compare([[[]]],[[]]) == -1);
//console.assert(compare([1,[2,[3,[4,[5,6,7]]]],8,9] ,[1,[2,[3,[4,[5,6,0]]]],8,9])==-1)

let part1 = comps.reduce((acc, [left, right], idx) => {
  console.log("Compare", left, "vs", right);
  let result = compare(left, right);
  return acc + (result > 0 ? idx + 1 : 0);
}, 0);

console.log("#1:", part1);
//console.assert(part1==6369)

// part2 sort

let messages = comps.flat();
messages.push([[2]]);
messages.push([[6]]);

messages.sort((a, b) => compare(b, a));
messages.forEach((x) => {
  console.log(x);
});

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
