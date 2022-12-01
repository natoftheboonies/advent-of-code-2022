import { promises } from "fs";

const sample = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

let puzzle = sample;
const dataBuf = await promises.readFile("input1");
puzzle = dataBuf.toString();
const elves = puzzle.split("\n\n").filter((line) => Boolean(line));

const calories = elves
  .map((elf) =>
    elf
      .split("\n")
      .map((n) => Number(n))
      .reduce((a, b) => a + b)
  )
  .sort((a, b) => b - a);
console.log("#1", calories[0]);

const part2 = calories.slice(0, 3).reduce((a, b) => a + b);
console.log("#2", part2);
