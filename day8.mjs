import { promises } from "fs";

const sample = `30373
25512
65332
33549
35390`;

const DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

let puzzle = sample;
const dataBuf = await promises.readFile("input8");
puzzle = dataBuf.toString();
const lines = puzzle.split("\n").filter((line) => Boolean(line));
const forest = lines.map((line) => line.split("").map((tree) => Number(tree)));

// all trees visible until we find otherwise
let part1 = forest[0].length * forest.length;

// find maximum score
let part2 = 0;

for (let y = 1; y < forest.length - 1; y++) {
  for (let x = 1; x < forest[y].length - 1; x++) {
    const tree = forest[y][x];
    // tree is visible of all the other trees are shorter.
    // tree is hidden if any of the other trees in 4 directions are same or taller
    const result = DIRS.map(([dx, dy]) => {
      //console.log("looking direction: ", dy, dx);
      let mult = 1;
      while (true) {
        const nx = x + dx * mult;
        const ny = y + dy * mult;
        if (nx < 0 || ny < 0 || nx >= forest[y].length || ny >= forest.length) {
          // reached the edge without finding a obscuring tree, visible
          return 1;
        }

        if (forest[ny][nx] >= tree) {
          // found a obscuring tree, hidden this direction
          return 0;
        }
        mult++;
      }
    });
    if (result.every((d) => d == 0)) {
      // obscuring trees in every direction
      part1--;
    }

    // part2 computation
    const score = DIRS.map(([dx, dy]) => {
      let mult = 1;
      while (true) {
        const nx = x + dx * mult;
        const ny = y + dy * mult;
        if (nx < 0 || nx >= forest[y].length || ny < 0 || ny >= forest.length) {
          // reached forest edge
          return mult - 1;
        }
        if (forest[ny][nx] >= tree) {
          // visible until mult
          return mult;
        }
        mult++;
      }
    }).reduce((a, b) => a * b);
    if (score > part2) part2 = score;
  }
}

console.log("#1", part1);

console.log("#2", part2);
