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
//console.log(signal);

function part1() {
  let cycle = 0;
  let ptr = 0;
  let register = 1;
  let processing = false;
  let part1 = 0;

  while (cycle < 220) {
    cycle++;
    if ((cycle - 20) % 40 == 0) {
      //console.log(cycle, register, cycle * register);
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
    } else {
      if (inst[0] != "noop") {
        console.error("unexpected inst", inst);
      }
    }
    if (!processing) ptr++;
    //console.log(cycle, part1);
  }
  return part1;
}

console.log("#1:", part1());

let cycle = 0;
let ptr = 0;
let register = 1;
let processing = false;

const part2 = new Array(6).fill(0).map((line) => new Array(40).fill(0));
function display(pixels) {
  pixels.forEach((line) => {
    const disp = line.map((c) => (c == 1 ? "#" : " ")).join("");
    console.log(disp); // PAPJCBHP
  });
}

let line = 0;

while (cycle < 240) {
  //sprite = cycle-1..cycle+1
  const pixel = cycle % 40;
  if (pixel == register || pixel == register + 1 || pixel == register - 1) {
    part2[line][pixel] = 1;
  }
  //console.log("cycle", cycle, part2[line]);
  cycle++;
  if (cycle % 40 == 0) {
    //console.log(cycle, register, cycle * register);
    line++;
  }
  const inst = signal[ptr];
  if (inst[0] == "addx") {
    if (processing) {
      register += inst[1];
      processing = false;
    } else {
      processing = true;
    }
  } else {
    if (inst[0] != "noop") {
      console.error("unexpected inst", inst);
    }
  }
  if (!processing) ptr++;
  //console.log(cycle, part1);
}

console.log("#2:");
display(part2);
