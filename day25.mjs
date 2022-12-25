import { promises } from "fs";

const sample = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

let puzzle = sample;

if (true) {
  const dataBuf = await promises.readFile("input25");
  puzzle = dataBuf.toString();
}

const snafus = puzzle.split("\n");

const LOOKUP = {
  2: 2,
  1: 1,
  0: 0,
  "-": -1,
  "=": -2,
};

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

const snafuToDecimal = (snafu) =>
  snafu
    .split("")
    .reverse()
    .reduce((acc, digit, f) => acc + 5 ** f * LOOKUP[digit], 0);

console.assert(snafuToDecimal("2=-01") == 976);
console.assert(snafuToDecimal("1121-1110-1=0") == 314159265);

// 3 -> 1=
// 8 -> 2=

function decimalToSnafu(value) {
  //   console.log(value, "->", value.toString(5));
  //   let foo = "";
  //   while (value > 0) {
  //     foo = (value % 5) + foo;
  //     value = Math.floor(value / 5);
  //   }
  //   console.log("foo", foo);

  let snafu = "";
  while (value > 0) {
    const bit = ((value + 2) % 5) - 2;
    snafu = getKeyByValue(LOOKUP, bit) + snafu;
    value = Math.floor((value + 2) / 5);
  }
  return snafu;
}

console.assert(decimalToSnafu(4890) == "2=-1=0");

let part1 = snafus.reduce((acc, snafu) => acc + snafuToDecimal(snafu), 0);
console.log("#1:", decimalToSnafu(part1));
