"use strict";

import { promises } from "fs";

const sample = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

let puzzle = sample;
const dataBuf = await promises.readFile("input14");
puzzle = dataBuf.toString();
const lines = puzzle.split("\n").filter((line) => Boolean(line));
const coords = lines.map((line) =>
  line.split(" -> ").map((pair) => pair.split(",").map((n) => Number(n)))
);
//mx,my,Mx,My
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
cave.set("500-0", "+");
coords.forEach((coord) => {
  //console.log("plot", coord);
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

function drawCave() {
  for (let y = dim[1]; y <= dim[3]; y++) {
    let line = "";
    for (let x = dim[0]; x <= dim[2]; x++) {
      line += cave.get(`${x}-${y}`) ?? ".";
    }
    console.log(line);
  }
}

let abyss = dim[3];
for (let u = 0; u < 3000; u++) {
  let sand = [500, 0];
  let rest = false;
  while (!rest) {
    if (!cave.has(`${sand[0]}-${sand[1] + 1}`)) sand[1]++;
    else if (!cave.has(`${sand[0] - 1}-${sand[1] + 1}`)) {
      sand[0]--;
      sand[1]++;
    } else if (!cave.has(`${sand[0] + 1}-${sand[1] + 1}`)) {
      sand[0]++;
      sand[1]++;
    } else {
      rest = true;
    }
    if (sand[1] > abyss) break;
  }
  if (sand[1] > abyss) {
    console.log("#1:", u);
    break;
  }
  cave.set(`${sand[0]}-${sand[1]}`, "o");
}
//drawCave();
