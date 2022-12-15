"use strict";

import { promises } from "fs";

const sample = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

let targetRow = 10;

let puzzle = sample;
const dataBuf = await promises.readFile("input15");
if (true) {
  targetRow = 2_000_000;
  puzzle = dataBuf.toString();
}
const lines = puzzle.split("\n").filter((line) => Boolean(line));
const coords = lines.map((line) =>
  [...line.matchAll(/-?\d+/g)].map((match) => Number(match[0]))
);

const sensors = coords.map((coord) => {
  const [sx, sy, bx, by] = coord;
  const dist = Math.abs(bx - sx) + Math.abs(by - sy);
  return [sx, sy, dist];
});

const rowBeacons = new Set();

coords
  .filter(([sx, sy, bx, by]) => by == targetRow)
  .forEach(([sx, sy, bx, by]) => rowBeacons.add(bx));
console.log("beacon:", rowBeacons);

const rowOverlap = new Set();

const overlapRow = sensors
  .filter(([x, y, dist]) => Math.abs(targetRow - y) < dist)
  .map(([x, y, dist]) => {
    const vert = dist - Math.abs(targetRow - y);
    return [x - vert, x + vert];
  });

overlapRow.sort((a, b) => a[0] - b[0]);
console.log("overlaps", overlapRow);

const reducedOverlaps = [];
overlapRow.forEach((range) => {
  if (reducedOverlaps.length == 0) reducedOverlaps.push(range);
  else {
    let cur = reducedOverlaps.at(-1);
    if (cur[1] >= range[0]) cur[1] = Math.max(cur[1], range[1]);
    else reducedOverlaps.push(range);
  }
});
console.log("reduced", reducedOverlaps);

const part1 = reducedOverlaps.reduce(
  (acc, range) => acc + range[1] - range[0] + 1,
  0
);

const b = [...rowBeacons].filter((b) =>
  reducedOverlaps.some(([x1, x2]) => b >= x1 && b <= x2)
).length;
console.log("b", b);

console.log("#1:", part1 - b);

//console.log(foo[0]);
