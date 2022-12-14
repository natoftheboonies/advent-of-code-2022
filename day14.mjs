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

const tap = [500, 0];

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
    [tap[0], tap[1], tap[0], tap[1]]
  );

//console.log(dim);

const toKey = ([x, y]) => y * 10000 + x;

const cave = new Map();
cave.set(toKey(tap), "+");
coords.forEach((coord) => {
  let point = coord.shift();
  cave.set(toKey(point), "#");
  while (coord.length) {
    const next = coord.shift();
    // calc vector
    let dx = Math.sign(next[0] - point[0]);
    let dy = Math.sign(next[1] - point[1]);
    while (point[0] - next[0] + point[1] - next[1] != 0) {
      point[0] += dx;
      point[1] += dy;
      cave.set(toKey(point), "#");
    }
    point = next;
  }
});

const drawCave = () => {
  for (let y = dim[1]; y <= dim[3]; y++) {
    let line = "";
    for (let x = dim[0]; x <= dim[2]; x++) {
      line += cave.get(toKey([x, y])) ?? ".";
    }
    console.log(line);
  }
};

let abyss = dim[3];
let part1 = 0;
while (true) {
  let sand = tap.slice();
  let rest = false;
  while (!rest && sand[1] <= abyss) {
    if (!cave.has(toKey([sand[0], sand[1] + 1]))) sand[1]++;
    else if (!cave.has(toKey([sand[0] - 1, sand[1] + 1]))) {
      sand[0]--;
      sand[1]++;
    } else if (!cave.has(toKey([sand[0] + 1, sand[1] + 1]))) {
      sand[0]++;
      sand[1]++;
    } else {
      rest = true;
    }
  }
  if (sand[1] > abyss) break;

  cave.set(toKey(sand), "o");
  part1++;
}
console.log("#1:", part1);

//drawCave();

// part2
dim[3] += 2;
let part2 = part1; // resume
while (true) {
  part2++;
  let sand = tap.slice();
  let rest = false;
  while (!rest) {
    if (sand[1] + 1 == dim[3]) rest = true; // floor
    else if (!cave.has(toKey([sand[0], sand[1] + 1]))) sand[1]++;
    else if (!cave.has(toKey([sand[0] - 1, sand[1] + 1]))) {
      sand[0]--;
      sand[1]++;
      dim[0] = Math.min(sand[0], dim[0]);
    } else if (!cave.has(toKey([sand[0] + 1, sand[1] + 1]))) {
      sand[0]++;
      sand[1]++;
      dim[2] = Math.max(sand[0], dim[2]);
    } else {
      rest = true;
    }
  }
  if (sand[1] == tap[1]) break;
  cave.set(toKey(sand), "o");
}

console.log("#2:", part2);
