import { promises } from "fs";

const sample = `A Y
B X
C Z`;

// score:  choice + outcome
// choices: 1 rock, 2 paper, 3 scissors
// outcomes: 0 lose, 3 draw, 6 win

const GAMES = {
  AY: 6 + 2, // paper beats rock
  BZ: 6 + 3, // scissors beats paper
  CX: 6 + 1, // rock beats scissors
  AX: 3 + 1, // rock
  BY: 3 + 2, // paper
  CZ: 3 + 3, // scissors
  AZ: 0 + 3, // scissors loses to rock
  BX: 0 + 1, // rock loses to paper
  CY: 0 + 2, // paper loses to scissors
};

let puzzle = sample;
const dataBuf = await promises.readFile("input2");
puzzle = dataBuf.toString();
const games = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .map((game) => game.split(" ").join(""));

const part1 = games.map((game) => GAMES[game]).reduce((a, b) => a + b);

console.log("#1", part1);

const PART2 = {
  AY: 1 + 3, // draw + rock
  BY: 2 + 3, // draw + paper
  CY: 3 + 3, // draw + scissors
  AX: 3 + 0, // lose + scissors (loses to rock)
  BX: 1 + 0, // lose + rock (loses to paper)
  CX: 2 + 0, // lose + paper (loses to scissors)
  AZ: 2 + 6, // win + paper (beats rock)
  BZ: 3 + 6, // win + scissors (beats paper)
  CZ: 1 + 6, // win + rock (beats scissors)
};

const part2 = games.map((game) => PART2[game]).reduce((a, b) => a + b);

console.log("#2", part2);
