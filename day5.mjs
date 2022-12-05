import { promises } from "fs";

const sample = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

let puzzle = sample;
const dataBuf = await promises.readFile("input5");
puzzle = dataBuf.toString();
const parts = puzzle.split("\n\n");

// extract diagram of initial state and move instructions
const diag = parts[0].split("\n").filter((line) => Boolean(line));
const inst = parts[1].split("\n").filter((line) => Boolean(line));
diag.reverse(); // to build arrays in order

// identify stack ids and char position
let stackIds = [...diag[0].matchAll(/\d+/g)];
// build pos map {id->index} and stacks array
const pos = new Map();
let stacks = new Array();
stackIds.forEach((m) => {
  pos.set(Number(m[0]), m.index);
  stacks.push(new Array());
});

// populate stacks
diag.slice(1).forEach((line) => {
  stacks.forEach((arr, i) => {
    let idx = pos.get(i + 1);
    if (line.charAt(idx) != " ") arr.push(line.charAt(idx));
  });
});

// parse moves into [num, from, to]
const moves = inst.map((inst) =>
  [...inst.matchAll(/\d+/g)].map((m) => Number(m[0]))
);
// deep copy stacks so we can reset for part2
const stacksPart1 = stacks.map((stack) => stack.slice());

// part 1
moves.forEach(([num, from, to]) => {
  // move between stacks 1 at a time
  for (let i = 0; i < num; i++) {
    stacksPart1[to - 1].push(stacksPart1[from - 1].pop());
  }
});

let part1 = stacksPart1.map((arr) => arr.slice(-1).pop()).join("");
console.log("#1", part1);

// part 2
moves.forEach(([num, from, to]) => {
  // move num stacks together from->to
  stacks[to - 1].push(...stacks[from - 1].splice(-num));
});

let part2 = stacks.map((arr) => arr.slice(-1).pop()).join("");
console.log("#2", part2);
