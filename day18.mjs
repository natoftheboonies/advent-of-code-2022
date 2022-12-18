"use strict";

import { promises } from "fs";

let sample = `1,1,1
2,1,1`;

let sample3 = `1,1,1
3,1,1`;

let sample2 = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

let puzzle = sample2;

if (true) {
  const dataBuf = await promises.readFile("input18");
  puzzle = dataBuf.toString().trim();
}

let cubes = puzzle
  .split("\n")
  .filter((x) => Boolean(x))
  .map((cube) => cube.split(",").map((n) => Number(n)));

let sides = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [-1, 0, 0],
  [0, -1, 0],
  [0, 0, -1],
];

let sum = 0;
for (const [cx, cy, cz] of cubes) {
  const edges = new Set();
  for (const [ex, ey, ez] of sides) {
    const result = [cx + ex, cy + ey, cz + ez];
    edges.add(result.join(","));
  }
  for (const cube of cubes) {
    edges.delete(cube.join(","));
  }
  //console.log(edges.size);
  sum += edges.size;
}

console.log("#1", sum);

sum = 0;
for (const [cx, cy, cz] of cubes) {
  const edges = new Set();
  for (const [ex, ey, ez] of sides) {
    const result = [cx + ex, cy + ey, cz + ez];
    edges.add(result.join(","));
  }
  for (const cube of cubes) {
    edges.delete(cube.join(","));
  }
  const exposedCubes = [...edges]
    .map((x) => x.split(",").map((f) => Number(f)))
    .filter(
      ([cx, cy, cz]) =>
        cubes.some(([ox, oy, oz]) => ox > cx && oy == cy && oz == cz) &&
        cubes.some(([ox, oy, oz]) => ox < cx && oy == cy && oz == cz) &&
        cubes.some(([ox, oy, oz]) => ox == cx && oy > cy && oz == cz) &&
        cubes.some(([ox, oy, oz]) => ox == cx && oy < cy && oz == cz) &&
        cubes.some(([ox, oy, oz]) => ox == cx && oy == cy && oz > cz) &&
        cubes.some(([ox, oy, oz]) => ox == cx && oy == cy && oz < cz)
    );
  if (exposedCubes) {
    //console.log(exposedCubes);
    exposedCubes.forEach((ex) => edges.delete(ex.join(",")));
  }
  //console.log(exposedCubes);
  sum += edges.size;
}

console.log("#2", sum); // 2408 wrong
