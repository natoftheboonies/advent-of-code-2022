import { promises } from "fs";

let sample = `noop
addx 3
addx -5`;

let puzzle = sample;

const dataBuf = await promises.readFile("input10");
puzzle = dataBuf.toString();
const signal = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .map((line) => line.split(" "));
signal.forEach((inst) => {
  if (inst.length > 1) inst[1] = Number(inst[1]);
});

let cycle = 0;
let ptr = 0;
let register = 1;
let processing = false;
let part1 = 0;

const part2 = new Array(6).fill(0).map((line) => new Array(40).fill(0));

while (cycle < 240) {
  const pixel = cycle % 40;
  if (Math.abs(pixel - register) < 2) {
    const line = Math.floor(cycle / 40);
    part2[line][pixel] = 1;
  }
  cycle++;
  if ((cycle - 20) % 40 == 0) {
    part1 += cycle * register;
  }
  const inst = signal[ptr];
  if (inst[0] == "addx") {
    if (processing) {
      register += inst[1];
      processing = false;
    } else {
      processing = true;
    }
  }
  if (!processing) ptr++;
}

console.log("#1:", part1);

console.log("#2:"); // PAPJCBHP
part2.forEach((line) => {
  const disp = line.map((c) => (c == 1 ? "#" : " ")).join("");
  console.log(disp);
});
