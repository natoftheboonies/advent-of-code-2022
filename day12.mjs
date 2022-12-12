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

// inspect maze
const dim = { row: topo.length, col: topo[0].length };

let start, goal;
topo.forEach((row, y) =>
  row.forEach((c, x) => {
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

// need integer keys, so use y*(dim.col)+x
const toKey = ([x, y]) => y * dim.col + x;
const fromKey = (key) => [key % dim.col, Math.floor(key / dim.col)];

// inspired by 2021 day 15
function djikstra(
  start = [0, 0],
  goalTest = ([x, y]) => topo[y][x] == 26,
  validMove = ([x, y], [hx, hy]) => topo[y][x] - topo[hy][hx] <= 1
) {
  const shortest = new Map([start]);
  const heap = new MinQueue(1024);
  heap.push(toKey(start), 0);

  while (heap.size) {
    const base_cost = heap.peekPriority();
    const last = heap.pop();
    const [hx, hy] = fromKey(last);
    if (goalTest([hx, hy])) {
      return base_cost;
    }
    DIRS.forEach(([dx, dy]) => {
      const x = hx + dx;
      const y = hy + dy;
      // out of bounds
      if (x >= dim.col || x < 0 || y >= dim.row || y < 0) return;
      if (hx >= dim.col || hx < 0 || hy >= dim.row || hy < 0) return;
      // illegal climb
      if (!validMove([x, y], [hx, hy])) return;
      const key = toKey([x, y]);

      // new cost for this node
      const neighbor_cost = base_cost + 1;
      if ((shortest.get(key) ?? 9999) > neighbor_cost) {
        shortest.set(key, neighbor_cost);
        heap.push(key, neighbor_cost);
      }
    });
  }
  console.error("goal not found");
}

console.log("#1:", djikstra());

// search from peak to low points
const part2 = djikstra(
  goal,
  ([x, y]) => topo[y][x] == 0,
  ([x, y], [hx, hy]) => topo[y][x] - topo[hy][hx] >= -1
);
console.log("#2:", part2);
