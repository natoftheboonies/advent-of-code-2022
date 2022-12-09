import { promises } from "fs";

const sample = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const sample2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

const DIRS = {
  R: [1, 0],
  U: [0, 1],
  L: [-1, 0],
  D: [0, -1],
};

let puzzle = sample2;
const dataBuf = await promises.readFile("input9");
puzzle = dataBuf.toString();
const moves = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .map((move) => move.split(" "));
moves.forEach((move) => (move[1] = Number(move[1])));

let pos = { x: 0, y: 0 };
let tail = { x: 0, y: 0 };
let visited = new Set();
for (const move of moves) {
  console.log(move, pos, tail);
  const [dx, dy] = DIRS[move[0]];
  const dist = move[1];
  //console.log(dx, dy, dist);
  for (let i = 0; i < dist; i++) {
    pos.x += dx;
    pos.y += dy;
    if (pos.y == tail.y) {
      if (Math.abs(pos.x - tail.x) > 1) tail.x += dx;
    } else if (pos.x == tail.x) {
      if (Math.abs(pos.y - tail.y) > 1) tail.y += dy;
    } else if (Math.abs(pos.y - tail.y) == 1 && Math.abs(pos.x - tail.x) == 1) {
      continue;
    } else {
      tail.y += pos.y > tail.y ? 1 : -1;
      tail.x += pos.x > tail.x ? 1 : -1;
    }
    visited.add(tail.y * 100_000 + tail.x);
  }
}
console.log("#1:", visited.size);

// part2, urk
const rope = new Array(10).fill(0).map((_) => new Object({ x: 0, y: 0 }));
let part2 = new Set();
for (const move of moves) {
  console.log(move, rope[0], rope[9]);
  const [dx, dy] = DIRS[move[0]];
  const dist = move[1];
  const debug = false && move[0] == "L" && dist == 8;
  if (debug) console.log("start", rope);
  //console.log(dx, dy, dist);
  for (let i = 0; i < dist; i++) {
    rope[0].x += dx;
    rope[0].y += dy;
    if (debug) {
      console.log("step", i, dx, dy);
    }
    for (let j = 1; j < rope.length; j++) {
      if (rope[j - 1].y == rope[j].y) {
        if (Math.abs(rope[j - 1].x - rope[j].x) == 2)
          rope[j].x += rope[j - 1].x > rope[j].x ? 1 : -1;
      } else if (rope[j - 1].x == rope[j].x) {
        if (Math.abs(rope[j - 1].y - rope[j].y) == 2)
          rope[j].y += rope[j - 1].y > rope[j].y ? 1 : -1;
      } else if (
        Math.abs(rope[j - 1].y - rope[j].y) == 1 &&
        Math.abs(rope[j - 1].x - rope[j].x) == 1
      ) {
        continue;
      } else {
        rope[j].y += rope[j - 1].y > rope[j].y ? 1 : -1;
        rope[j].x += rope[j - 1].x > rope[j].x ? 1 : -1;
      }
    }
    if (debug) console.log(dist, rope);
    part2.add(rope[9].y * 100_000 + rope[9].x);
  }
  console.log("end", rope);
  if (debug) break;
}

console.log("#2:", part2.size);
