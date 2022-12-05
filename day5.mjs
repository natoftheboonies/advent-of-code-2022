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

const diag = parts[0].split("\n").filter((line) => Boolean(line));
const inst = parts[1].split("\n").filter((line) => Boolean(line));
diag.reverse();

function solve1() {
  let stackIds = [...diag[0].matchAll(/\d+/g)];
  const pos = new Map();
  const stacks = new Array();
  stackIds.forEach((m) => {
    pos.set(Number(m[0]), m.index);
    stacks.push(new Array());
  });
  //console.log(pos);

  diag.slice(1).forEach((line) => {
    stacks.forEach((arr, i) => {
      let idx = pos.get(i + 1);
      if (line.charAt(idx) != " ") arr.push(line.charAt(idx));
    });
  });

  //console.log(stacks);

  const moves = inst.map((inst) =>
    [...inst.matchAll(/\d+/g)].map((m) => Number(m[0]))
  );
  //console.log(moves);
  moves.forEach(([num, from, to]) => {
    for (let i = 0; i < num; i++) {
      stacks[to - 1].push(stacks[from - 1].pop());
    }
  });
  //console.log(stacks);

  let part1 = stacks.map((arr) => arr.slice(-1).pop()).join("");
  return part1;
}

function solve2() {
  let stackIds = [...diag[0].matchAll(/\d+/g)];
  const pos = new Map();
  const stacks = new Array();
  stackIds.forEach((m) => {
    pos.set(Number(m[0]), m.index);
    stacks.push(new Array());
  });
  //console.log(pos);

  diag.slice(1).forEach((line) => {
    stacks.forEach((arr, i) => {
      let idx = pos.get(i + 1);
      if (line.charAt(idx) != " ") arr.push(line.charAt(idx));
    });
  });

  //console.log(stacks);

  const moves = inst.map((inst) =>
    [...inst.matchAll(/\d+/g)].map((m) => Number(m[0]))
  );
  //console.log(moves);
  moves.forEach(([num, from, to]) => {
    //console.log(`move ${num} from ${from} to ${to}: ${stacks[from - 1]}`);
    const moved = stacks[from - 1].splice(-num);
    //console.log("moved", moved);
    moved.forEach((box) => stacks[to - 1].push(box));
    //console.log(stacks);
  });

  let part2 = stacks.map((arr) => arr.slice(-1).pop()).join("");
  return part2;
}

console.log("#1", solve1());
console.log("#2", solve2());
