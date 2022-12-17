"use strict";

import { promises } from "fs";

const sample = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

let puzzle = sample;

if (true) {
  const dataBuf = await promises.readFile("input17");
  puzzle = dataBuf.toString().trim();
}

const jets = puzzle
  .split("")
  .filter((line) => Boolean(line))
  .map((c) => (c == ">" ? 1 : -1));
console.assert(jets.length == puzzle.length);

let pieces = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`
  .split("\n\n")
  .map((rock) =>
    rock
      .split("\n")
      .reverse()
      .map((row, y) =>
        row
          .split("")
          .map((c, x) => (c == "#" ? [x, y] : ""))
          .filter((c) => Boolean(c))
      )
      .flat()
  );

function drawChamber() {
  var setMax = Math.ceil(Math.max(...chamber) / 10);
  console.log(setMax);

  for (let y = setMax; y >= 0; y--) {
    let line = "|";
    for (let x = 0; x < 7; x++) {
      line += chamber.has(toKey([x, y])) ? "#" : ".";
    }
    console.log(line + "|");
  }
  console.log("+-------+");
}
//console.log(pieces);

// witdh = 7
// rocks appear +4 above base

// sample is 10 rocks

// store settled rocks and top
const chamber = new Set();
let top = -1;

const toKey = ([x, y]) => y * 10 + x;
let i = 0;
let jet = 0;
while (i < 2022) {
  const rock = pieces.at(i % 5);
  let pos = [2, top + 4];
  //console.log("rock", i, i % 5, rock, "at", pos);
  const dy = -1;
  while (true) {
    const dx = jets.at(jet % jets.length);
    // can jet move rock?
    if (
      dx &&
      rock.every(([x, y]) => {
        let nx = x + pos[0] + dx;
        let ny = y + pos[1];
        let oob = nx > 6 || nx < 0;
        let obs = chamber.has(toKey([nx, ny]));
        return !oob && !obs;
      })
    ) {
      pos[0] += dx;
      //console.log("shift", dx == 1 ? "right" : "left");
    } else {
      //console.log("shift", dx == 1 ? "right" : "left", "blocked");
    }
    jet++;

    // can rock drop?
    if (
      rock.every(([x, y]) => {
        const nx = x + pos[0],
          ny = y + pos[1] + dy;
        const up = ny > -1;
        const blocked = chamber.has(toKey([nx, ny]));
        return up && !blocked;
      })
    ) {
      pos[1] += dy;
      //console.log("drop", dy);
    } else {
      //console.log("settle rock");
      rock.forEach(([x, y]) => {
        chamber.add(toKey([x + pos[0], y + pos[1]]));
        top = Math.max(top, y + pos[1]);
      });

      break;
    }

    //console.log("now at", pos);
  }
  i++;
}
//drawChamber();
console.log("top:", top + 1); // 2485 too low, 3081, 3082 too high
console.log(Math.max(...chamber));
