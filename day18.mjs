"use strict";

import { promises } from "fs";

let sample = `1,1,1
2,1,1`;

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

const limits = cubes.reduce(
  (acc, cube) => {
    acc.x = [Math.min(cube[0], acc.x[0]), Math.max(cube[0], acc.x[1])];
    acc.y = [Math.min(cube[1], acc.y[0]), Math.max(cube[1], acc.y[1])];
    acc.z = [Math.min(cube[2], acc.z[0]), Math.max(cube[2], acc.z[1])];
    return acc;
  },
  {
    x: [Infinity, -Infinity],
    y: [Infinity, -Infinity],
    z: [Infinity, -Infinity],
  }
);

//console.log(limits);

const isCube = (x, y, z) =>
  cubes.some(([tx, ty, tz]) => tx == x && ty == y && tz == z);

let sum = 0;
cubes.forEach(([cx, cy, cz]) =>
  sides.forEach(([ex, ey, ez]) => {
    if (!isCube(cx + ex, cy + ey, cz + ez)) {
      sum++;
    }
  })
);

console.log("#1", sum);

// part 2
sum = 0;
const visited = new Set();

//start outside the cube
const queue = [[limits.x[0] - 1, limits.y[0] - 1, limits.z[0] - 1]];

while (queue.length > 0) {
  const [ex, ey, ez] = queue.pop();
  const key = [ex, ey, ez].join(",");
  if (visited.has(key)) continue;
  visited.add(key);
  // explore in all directions
  sides.forEach(([dx, dy, dz]) => {
    const tx = ex + dx;
    const ty = ey + dy;
    const tz = ez + dz;

    // except not too far out of bounds
    if (
      tx < limits.x[0] - 1 ||
      ty < limits.y[0] - 1 ||
      tz < limits.z[0] - 1 ||
      tx > limits.x[1] + 1 ||
      ty > limits.y[1] + 1 ||
      tz > limits.z[1] + 1
    )
      return;

    if (isCube(tx, ty, tz)) {
      // if we are next to a cube, we are an exposed edge
      sum++;
    } else {
      queue.push([tx, ty, tz]);
    }
  });
}

console.log("#2", sum);
