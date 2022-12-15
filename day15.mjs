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
let searchMax = 20;
let puzzle = sample;

if (true) {
  targetRow = 2_000_000;
  searchMax = 4_000_000;
  const dataBuf = await promises.readFile("input15");
  puzzle = dataBuf.toString();
}

const lines = puzzle.split("\n").filter((line) => Boolean(line));
const coords = lines.map((line) =>
  [...line.matchAll(/-?\d+/g)].map((match) => Number(match[0]))
);

// x, y, distance from beacon
const sensors = coords.map(([sx, sy, bx, by]) => [
  sx,
  sy,
  Math.abs(bx - sx) + Math.abs(by - sy),
]);

const beacons = coords.map(([sx, sy, bx, by]) => [bx, by]);

function getOverlaps(targetRow) {
  const overlapRow = sensors
    .filter(([_, y, dist]) => Math.abs(targetRow - y) < dist)
    .map(([x, y, dist]) => {
      const vert = dist - Math.abs(targetRow - y);
      return [x - vert, x + vert];
    })
    .sort((a, b) => a[0] - b[0]);

  // consolidate overlaps
  const reducedOverlaps = overlapRow.reduce((reduced, range) => {
    if (reduced.length == 0) reduced.push(range);
    else {
      let cur = reduced.at(-1);
      if (cur[1] >= range[0] - 1) cur[1] = Math.max(cur[1], range[1]);
      else reduced.push(range);
    }
    return reduced;
  }, []);

  return reducedOverlaps;
}

const reducedOverlaps = getOverlaps(targetRow);

// filter beacons to those within targetRow
const relevantBeacons = beacons.filter(
  ([bx, by]) =>
    by == targetRow && reducedOverlaps.some(([x1, x2]) => bx >= x1 && bx <= x2)
);

const part1 =
  reducedOverlaps.reduce((acc, range) => acc + range[1] - range[0] + 1, 0) -
  relevantBeacons.length;

console.log("#1:", part1);

// part2, search (backwards, cuz it's a puzzle)
function part2() {
  for (let i = searchMax; i >= 0; i--) {
    const reducedOverlaps = getOverlaps(i);
    if (reducedOverlaps.length > 1) {
      return 4000000 * (reducedOverlaps[0][1] + 1) + i;
    }
  }
  return -1;
}

console.log("#2:", part2());
