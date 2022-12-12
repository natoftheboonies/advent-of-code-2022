import { promises } from "fs";
import { MinQueue } from "heapify/heapify.mjs";

const sample = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

let puzzle = sample;
const dataBuf = await promises.readFile("input12");
puzzle = dataBuf.toString();
const lines = puzzle.split("\n").filter((line) => Boolean(line));
const topo = lines.map((line) =>
  line.split("").map((tree) => Number(tree.charCodeAt() - 97))
);

//console.log(topo);

let start, goal;
topo.forEach((row, y) =>
  row.forEach((c, x) => {
    //console.log(c, "E".charCodeAt() - 97);
    if (c == "S".charCodeAt() - 97) {
      start = [x, y];
      topo[y][x] = 0;
    }
    if (c == "E".charCodeAt() - 97) {
      goal = [x, y];
      topo[y][x] = 26;
    }
  })
);

console.log(start, goal);

const dim = { row: topo.length, col: topo[0].length };
console.log("maze dim", dim);

const toKey = ([x, y]) => y * dim.col + x;
const fromKey = (key) => [key % dim.col, Math.floor(key / dim.col)];

// copied from 2021 day 15
function djikstra() {
  //const goal = [dim.col * mult - 1, dim.row * mult - 1];
  const shortest = new Map([start]);
  console.log("goal is", goal);
  const mult = 1;

  const heap = new MinQueue(1024);
  // need integer keys, so use y*(dim.col*mult)+x
  heap.push(toKey(start), 0);

  let maxDepth = 0;

  while (heap.size) {
    const base_cost = heap.peekPriority();
    const last = heap.pop();
    const [hx, hy] = fromKey(last);
    // const hy = Math.floor(last / (dim.row * mult));
    // const hx = last % (dim.row * mult);
    if (hx == goal[0] && hy == goal[1]) {
      console.log("goal!", heap.size);

      return base_cost;
    }
    // for (const [dx, dy] of DIRS) {
    DIRS.forEach(([dx, dy]) => {
      const x = hx + dx;
      const y = hy + dy;
      // out of bounds
      if (x >= dim.col || x < 0 || y >= dim.row || y < 0) return;
      if (hx >= dim.col || hx < 0 || hy >= dim.row || hy < 0) return;
      // illegal climb
      if (topo[y][x] - topo[hy][hx] > 1) return;
      //console.log("valid", y, x, "from", hy, hx);
      const key = toKey([x, y]);
      if (topo[y][x] > maxDepth) maxDepth = topo[y][x];

      let cost = 1;
      // new cost for this node
      const neighbor_cost = base_cost + cost;
      if ((shortest.get(key) ?? 9999) > neighbor_cost) {
        //console.log("set", key, "priority", neighbor_cost);
        shortest.set(key, neighbor_cost);
        heap.push(key, neighbor_cost);
      }
    });
  }
  console.log("game over", maxDepth);
}

console.log("part1", djikstra());

// search from goal to height 0
function part2() {
  //const goal = [dim.col * mult - 1, dim.row * mult - 1];
  const shortest = new Map([goal]);

  const heap = new MinQueue(1024);
  // need integer keys, so use y*(dim.col*mult)+x
  heap.push(toKey(goal), 0);

  let maxDepth = 0;

  while (heap.size) {
    const base_cost = heap.peekPriority();
    const last = heap.pop();
    const [hx, hy] = fromKey(last);
    // const hy = Math.floor(last / (dim.row * mult));
    // const hx = last % (dim.row * mult);
    if (topo[hy][hx] == 0) {
      console.log("goal!", heap.size, hx, hy);

      return base_cost;
    }
    // for (const [dx, dy] of DIRS) {
    DIRS.forEach(([dx, dy]) => {
      const x = hx + dx;
      const y = hy + dy;
      // out of bounds
      if (x >= dim.col || x < 0 || y >= dim.row || y < 0) return;
      if (hx >= dim.col || hx < 0 || hy >= dim.row || hy < 0) return;
      // illegal climb
      if (topo[y][x] - topo[hy][hx] < -1) return;
      //console.log("valid", y, x, "from", hy, hx);
      const key = toKey([x, y]);
      if (topo[y][x] > maxDepth) maxDepth = topo[y][x];

      let cost = 1;
      // new cost for this node
      const neighbor_cost = base_cost + cost;
      if ((shortest.get(key) ?? 9999) > neighbor_cost) {
        //console.log("set", key, "priority", neighbor_cost);
        shortest.set(key, neighbor_cost);
        heap.push(key, neighbor_cost);
      }
    });
  }
  console.log("game over", maxDepth);
}

console.log("#2:", part2());
