import { promises } from "fs";
import { MinQueue } from "heapify/heapify.mjs";
// https://github.com/luciopaiva/heapify

let sample = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

let puzzle = sample;

if (true) {
  const dataBuf = await promises.readFile("input24");
  puzzle = dataBuf.toString();
}

const LOOKUP = {
  ".": 0,
  "^": 1, // 0001
  v: 2, // 0010
  "<": 4, // 0100
  ">": 8, // 1000
};

const maze = puzzle.split("\n").filter((line) => Boolean(line));

const entry = maze.shift().indexOf(".") - 1;
const exit = maze.pop().indexOf(".") - 1;
const canyon = maze.map((row, y) =>
  row
    .split("")
    .slice(1, -1)
    .map((c) => LOOKUP[c])
);

const height = canyon.length;
const width = canyon[0].length;

const canyonCache = new Map();

function nextCanyon(canyon, time) {
  if (canyonCache.has(time)) return canyonCache.get(time);

  const canyonNew = new Array(height)
    .fill(0)
    .map((x) => new Array(width).fill(0));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // fill canyonNew[y][x]
      const left = (x - (time % width) + width) % width;
      const right = (x + time) % width;
      const up = (y - (time % height) + height) % height;
      const down = (y + time) % height;
      canyonNew[y][x] +=
        (canyon[y][left] & LOOKUP[">"]) !== 0 ? LOOKUP[">"] : 0;
      canyonNew[y][x] +=
        (canyon[y][right] & LOOKUP["<"]) !== 0 ? LOOKUP["<"] : 0;
      canyonNew[y][x] += (canyon[up][x] & LOOKUP["v"]) !== 0 ? LOOKUP["v"] : 0;
      canyonNew[y][x] +=
        (canyon[down][x] & LOOKUP["^"]) !== 0 ? LOOKUP["^"] : 0;
    }
  }
  canyonCache.set(time, canyonNew);
  return canyonNew;
}

// ok, let's play!
const start = [entry, -1];
const goal = [exit, canyon.length];

let yMult = width;

// need integer keys, so use y*(yMult)+x
const toKey = ([x, y], time) => {
  let neg = 1;
  if (y === -1) {
    neg = -1;
    y *= neg;
  }
  return neg * (1e6 * time + y * yMult + x);
};
const fromKey = (key) => {
  let neg = 1;
  if (key < 0) {
    neg = -1;
    key *= neg;
  }
  const time = Math.floor(key / 1e6);
  key %= 1e6;
  const [x, y] = [key % yMult, Math.floor(key / yMult) * neg];
  return [[x, y], time];
};

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [0, 0], // also stay put
];

// inspired by 2022 day 12
function djikstra(start, goal, time = 0) {
  const heap = new MinQueue(2048, [], [], Int32Array);
  const hStart = Math.abs(goal[0] - start[0]) + Math.abs(goal[1] - start[1]);

  heap.push(toKey(start, time), time + hStart);

  const shortest = new Map();
  shortest.set(heap.peek(), 0);

  while (heap.size) {
    const last = heap.pop();
    const [[hx, hy], time] = fromKey(last);
    //console.log("at time", time, "checking", hx, hy);

    if (hx == goal[0] && hy == goal[1]) {
      return time;
    }

    if (hx >= width || hx < 0 || hy > height || hy < -1) continue;
    const canyonNext = nextCanyon(canyon, time + 1);

    for (const [dx, dy] of DIRS) {
      const x = hx + dx;
      const y = hy + dy;

      // out of bounds
      if (x >= width || x < 0 || y > height || y < -1) continue;
      if (y === start[1] && x !== start[0]) continue;
      if (y === goal[1] && x != goal[0]) continue;
      // no moving into blizzard
      if (y > -1 && y < canyonNext.length && canyonNext[y][x] > 0) continue;

      const key = toKey([x, y], time + 1);
      // new cost for this node
      const h = Math.abs(goal[0] - x) + Math.abs(goal[1] - y);
      const neighbor_cost = time + 1 + h;
      if ((shortest.get(key) ?? Infinity) > neighbor_cost) {
        shortest.set(key, neighbor_cost);
        heap.push(key, neighbor_cost);
      }
    }
  }
  console.error("goal not found");
}

let part1 = djikstra(start, goal);
console.log("#1:", part1);

let snackRun = djikstra(goal, start, part1);
//console.log("snackRun", snackRun - part1);

let part2 = djikstra(start, goal, snackRun);
//console.log("returnTrip", part2 - snackRun);
console.log("#2:", part2);
