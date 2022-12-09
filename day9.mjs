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

function moveRope(knots) {
  // initialize rope to `knots` length
  const rope = new Array(knots).fill(0).map((_) => new Object({ x: 0, y: 0 }));
  let visited = new Set();
  for (const move of moves) {
    const [dx, dy] = DIRS[move[0]];
    const dist = move[1];
    for (let i = 0; i < dist; i++) {
      // move head
      rope[0].x += dx;
      rope[0].y += dy;
      // move rest of rope
      for (let j = 1; j < rope.length; j++) {
        if (rope[j - 1].y == rope[j].y) {
          // move horizontally
          if (Math.abs(rope[j - 1].x - rope[j].x) > 1)
            rope[j].x += rope[j - 1].x > rope[j].x ? 1 : -1;
        } else if (rope[j - 1].x == rope[j].x) {
          //move vertically
          if (Math.abs(rope[j - 1].y - rope[j].y) > 1)
            rope[j].y += rope[j - 1].y > rope[j].y ? 1 : -1;
        } else if (
          Math.abs(rope[j - 1].y - rope[j].y) > 1 ||
          Math.abs(rope[j - 1].x - rope[j].x) > 1
        ) {
          // move diagonally
          rope[j].y += rope[j - 1].y > rope[j].y ? 1 : -1;
          rope[j].x += rope[j - 1].x > rope[j].x ? 1 : -1;
        }
      }
      // convert position to integer to store in a set
      visited.add(rope.at(-1).y * 100_000 + rope.at(-1).x);
    }
  }
  return visited.size;
}

console.log("#1:", moveRope(2));
console.log("#2:", moveRope(10));
