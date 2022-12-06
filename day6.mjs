import { promises } from "fs";

const sample = `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`;

let puzzle = sample;
const dataBuf = await promises.readFile("input6");
puzzle = dataBuf.toString();
const signal = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .at(0);

let part1 = 0;
let part2 = 0;

for (let i = 4; i < signal.length; i++) {
  let snip = signal.slice(i - 4, i);
  if (!part1 && new Set([...snip]).size == 4) {
    //console.log(i, snip);
    part1 = i;
  }
  if (i >= 14) {
    let snip = signal.slice(i - 14, i);
    if (new Set([...snip]).size == 14) {
      //console.log(i, snip);
      part2 = i;
      break;
    }
  }
}

console.log("#1:", part1);
console.log("#2:", part2);
