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
//console.log(forest);

const result = new Array(forest.length)
  .fill(0)
  .map((_) => new Array(forest[0].length).fill(1));

//console.log(result);

let counter = 0;

for (let y = 1; y < forest.length - 1; y++) {
  for (let x = 1; x < forest[y].length - 1; x++) {
    const tree = forest[y][x];
    let visible = [];
    // tree is visible of all the other trees are shorter.
    // tree is hidden if any of the other trees in 4 directions are same or taller?
    for (const [dx, dy] of DIRS) {
      //console.log("looking direction: ", dy, dx);
      let mult = 1;
      while (true) {
        const nx = x + dx * mult;
        const ny = y + dy * mult;
        if (nx < 0 || nx >= forest[y].length || ny < 0 || ny >= forest.length) {
          // reached the edge without finding a taller tree, visible
          visible.push(1);
          break;
        }
        /*
        console.log(
          "compare tree",
          tree,
          "at",
          y,
          x,
          "with taller",
          forest[ny][nx],
          "at",
          ny,
          nx
        );
        */

        if (forest[ny][nx] >= tree) {
          // found a taller tree, hidden this direction
          visible.push(0);
          break;
        }
        mult++;
      }
    }
    if (visible.every((d) => d == 0)) {
      console.log("tree", tree, "at", y, x, "is hidden");
      result[y][x] = 0;
      counter++;
    }
  }
}

const part1 = forest[0].length * forest.length - counter;
console.log("#1:", part1);

let part2 = 0;
for (let y = 1; y < forest.length - 1; y++) {
  for (let x = 1; x < forest[y].length - 1; x++) {
    const tree = forest[y][x];
    console.log("tree", tree, "at", y, x);
    let visible = [];
    // tree is visible of all the other trees are shorter.
    // tree is hidden if any of the other trees in 4 directions are same or taller?
    const score = DIRS.map(([dx, dy]) => {
      //console.log("looking direction: ", dy, dx);
      let mult = 1;
      while (true) {
        const nx = x + dx * mult;
        const ny = y + dy * mult;
        if (nx < 0 || nx >= forest[y].length || ny < 0 || ny >= forest.length) {
          mult--;
          break;
        }
        if (forest[ny][nx] >= tree) {
          // found a taller tree, hidden this direction
          //console.log("taller", forest[ny][nx], "at", ny, nx);
          break;
        }
        mult++;
      }
      //console.log("dir", dy, dx, "has", mult);
      return mult;
    }).reduce((a, b) => a * b);
    console.log("has score", score);
    console.log();
    if (score > part2) part2 = score;
  }
}

console.log("#2", part2);
