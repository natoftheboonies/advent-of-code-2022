import { promises } from "fs";

const sample = `A Y
B X
C Z`;

// score = choice + outcome
// 1 rock, 2 paper, 3 scissors
// 0 lost, 3 draw, 6 won

const POINTS = { X: 1, Y: 2, Z: 3, A: 1, B: 2, C: 3 };

const GAMES = { AY: 6, BZ: 6, CX: 6, AX: 3, BY: 3, CZ: 3, AZ: 0, BX: 0, CY: 0 };

// part2 X = 0, Y = 3, Z = 6
//const PART2 = {X: 0, Y: 3, Z: 6}

const PART2 = { AY: 4, BZ: 9, CX: 2, AX: 3, BY: 5, CZ: 7, AZ: 8, BX: 1, CY: 6 };

let puzzle = sample;
const dataBuf = await promises.readFile("input2");
puzzle = dataBuf.toString();
const games = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .map((game) => game.split(" "));
//console.log(games);

const part1 = games
  .map((game) => GAMES[game.join("")] + POINTS[game[1]])
  .reduce((a, b) => a + b);

console.log("#1", part1); // wrong 12865

const part2 = games.map((game) => PART2[game.join("")]).reduce((a, b) => a + b);

console.log("#2", part2); // wrong 12944

/*
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
*/
