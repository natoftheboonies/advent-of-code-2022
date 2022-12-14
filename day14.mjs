"use strict";

import { promises } from "fs";

const sample = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

let puzzle = sample;
// const dataBuf = await promises.readFile("input13");
// puzzle = dataBuf.toString();
const lines = puzzle.split("\n").filter((line) => Boolean(line));
const coords = lines.map((line) =>
  line.split(" -> ").map((pair) => pair.split(",").map((n) => Number(n)))
);
//mx,my,Mx,My
console.log(coords.flat());
let dim = coords
  .flat()
  .reduce(
    (acc, cur) => [
      Math.min(acc[0], cur[0]),
      Math.min(acc[1], cur[1]),
      Math.max(acc[2], cur[0]),
      Math.max(acc[3], cur[1]),
    ],
    [500, 0, 500, 0]
  );

console.log(dim);

const cave = new Map();
coords.forEach((coord) => {
  console.log("plot", coord);
  let point = coord.shift();
  cave.set(`${point[0]}-${point[1]}`, "#");
  while (coord.length) {
    const next = coord.shift();
    // calc vector
    let dx = Math.sign(next[0] - point[0]);
    let dy = Math.sign(next[1] - point[1]);
    console.assert(Math.abs(dx) + Math.abs(dy) == 1);
    while (point[0] - next[0] + point[1] - next[1] != 0) {
      point[0] += dx;
      point[1] += dy;
      //console.log(`${point[0]}-${point[1]}`);
      cave.set(`${point[0]}-${point[1]}`, "#");
    }
    point = next;
  }
});
console.log("done");

function drawCave() {}
