import { promises } from "fs";
import { MinQueue } from "heapify/heapify.mjs";
// https://github.com/luciopaiva/heapify

let sample0 = `#.#####
#.....#
#>....#
#.....#
#...v.#
#.....#
#####.#`;

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

//console.log(entry, exit);
//console.log(canyon);

const height = canyon.length;
const width = canyon[0].length;

function nextCanyon(canyon, time) {
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
      //console.log(left, right, up, down);
      canyonNew[y][x] +=
        (canyon[y][left] & LOOKUP[">"]) !== 0 ? LOOKUP[">"] : 0;
      canyonNew[y][x] +=
        (canyon[y][right] & LOOKUP["<"]) !== 0 ? LOOKUP["<"] : 0;
      canyonNew[y][x] += (canyon[up][x] & LOOKUP["v"]) !== 0 ? LOOKUP["v"] : 0;
      canyonNew[y][x] +=
        (canyon[down][x] & LOOKUP["^"]) !== 0 ? LOOKUP["^"] : 0;
    }
  }
  //console.log(time, canyonNew);
  return canyonNew;
}

//nextCanyon(canyon, 18);

// ok, let's play!
let pos = [entry, -1];
const target = [exit, canyon.length];

let yMult = width + 1;

// need integer keys, so use y*(yMult)+x
const toKey = ([x, y], time) => {
  let neg = 1;
  if (y === -1) {
    neg = -1;
    y *= neg;
    //console.log("tk", y, neg);
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

// console.log("foo");
// let cases = [[0, -1], 4];
// let result = toKey(...cases);
// console.log(cases);
// console.log(result);
// console.log(fromKey(result));

// console.log("maze bottom right:", width, height);
// let result = toKey([4, 4], 4096);
// console.log(result);
// console.log(fromKey(result));

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
  [0, 0], // also stay put
];

// inspired by 2022 day 12
function djikstra(start, goal) {
  const shortest = new Map([start]);
  const seen = new Set();
  const heap = new MinQueue(2048, [], [], Int32Array);
  const hStart = Math.abs(goal[0] - start[0]) + Math.abs(goal[1] - start[1]);
  // time 0
  const foo = toKey(start, 0);
  //console.log("foo", foo);
  heap.push(foo, 0 + hStart);
  seen.add(foo);

  while (heap.size) {
    //const base_cost = heap.peekPriority();
    const last = heap.pop();
    const [[hx, hy], time] = fromKey(last);
    //console.log("at time", time, "checking", hx, hy);

    if (hx == goal[0] && hy == goal[1]) {
      return time;
    }

    const canyonNext = nextCanyon(canyon, time + 1);
    //console.log(canyonNext);

    for (const [dx, dy] of DIRS) {
      //    DIRS.forEach(([dx, dy]) => {
      const x = hx + dx;
      const y = hy + dy;

      if (x == goal[0] && y == goal[1]) {
        console.log("GOAL");
        return time + 1;
      }
      // out of bounds, and already checked goal
      if (x >= width || x < 0 || y >= height || y < -1) continue;
      if (hx >= width || hx < 0 || hy >= height || hy < -1) continue;
      if (y === -1 && x !== 0) continue;
      // no moving into blizzard
      // if (time === 1) {
      //   console.log("checking", x, y, "->", canyonNext[y][x]);
      //   console.log("row", canyonNext[y], x, canyonNext[y][0]);
      //   console.log(canyonNext);
      // }
      if (y > -1 && canyonNext[y][x] > 0) continue;
      //console.log("valid");

      const key = toKey([x, y], time + 1);
      // new cost for this node
      const h = Math.abs(goal[0] - x) + Math.abs(goal[1] - y);
      const neighbor_cost = time + 1 + h;
      if ((shortest.get(key) ?? Infinity) > neighbor_cost) {
        shortest.set(key, neighbor_cost);
        heap.push(key, neighbor_cost);
      }
    }
    //break;
  }
  console.error("goal not found");
  // console.log(shortest);
}

console.log("start", pos);
console.log("goal", target);

let part1 = djikstra(pos, target);
console.log("#1", part1);
