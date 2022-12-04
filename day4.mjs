import { promises } from "fs";

const sample = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

let puzzle = sample;
const dataBuf = await promises.readFile("input4");
puzzle = dataBuf.toString();
const pairs = puzzle.split("\n").filter((line) => Boolean(line));

const part1 = pairs
  .map((pair) =>
    pair.split(",").map((range) => range.split("-").map((n) => Number(n)))
  )
  .filter(([left, right]) => {
    //console.log(left, right);
    if (
      (left[0] <= right[0] && left[1] >= right[1]) ||
      (left[0] >= right[0] && left[1] <= right[1])
    )
      return true;
    return false;
  }).length;

console.log("#1", part1);

const part2 = pairs
  .map((pair) =>
    pair.split(",").map((range) => range.split("-").map((n) => Number(n)))
  )
  .filter(([left, right]) => {
    //console.log(left, right);
    if (
      (left[0] <= right[0] && left[1] >= right[0]) ||
      (left[0] <= right[1] && left[1] >= right[1]) ||
      (right[0] <= left[0] && right[1] >= left[0]) ||
      (right[0] <= left[1] && right[1] >= left[1])
    )
      return true;
    return false;
  }).length;

console.log("#2", part2); // not 962
