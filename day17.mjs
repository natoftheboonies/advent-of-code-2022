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
let heights = [];
let seen = new Map();

let tracking = false;
let trackingLevel = 0;
let tracks = [];
const sequence = [];

while (i < 20220) {
  const rock = pieces.at(i % 5);
  let pos = [2, top + 4];
  const priorTop = top;
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
  const height = top - priorTop;
  heights.push(height);

  if (heights.length > 30) {
    const situation = `${jet % jets.length},${i % 5},${heights
      .slice(-30)
      .join(",")}`;
    if (seen.has(situation)) {
      //console.log("we've been here before", situation);
      if (!tracking) {
        console.log("start", top, i);
        tracks.push([top, i]);
        trackingLevel = seen.get(situation);
        tracking = true;
      } else if (trackingLevel < seen.get(situation)) {
        console.log("reset", top, i);
        tracks.push([top, i]);
        trackingLevel = seen.get(situation);
      }
      seen.set(situation, seen.get(situation) + 1);
    } else {
      if (tracking) {
        console.log("stop", top);
        tracking = false;
      }

      seen.set(situation, 1);
    }
  }
  // prune set
  for (const key of chamber) {
    if (key / 10 + 50 < top) chamber.delete(key);
  }
  //console.log(chamber.size);
}
//drawChamber();
console.log("top:", top + 1); // 2485 too low, 3081, 3082 too high
//console.log(Math.max(...chamber));

let x = 0;
for (const situation of seen.keys()) {
  if (seen.get(situation) > 10) {
    //console.log(situation, seen.get(situation));
    x++;
  }
}
//console.log("cycle length", tracks, x);
// cycle is 2582 height in 1705 blocks

console.log("h:", heights.length);

const cycleHeight = tracks[3][0] - tracks[2][0];
const cycleBlocks = tracks[3][1] - tracks[2][1];

const [startHeight, startBlocks] = tracks[0];

console.log(
  "chk",
  heights.slice(startBlocks, startBlocks + cycleBlocks).reduce((a, b) => a + b)
);

console.log("start b/h", startBlocks, startHeight);
console.log("cycle (b, h)", cycleBlocks, cycleHeight);
const mult = Math.floor((1e12 - startBlocks) / cycleBlocks);
console.log("num cycles", mult);

const tailBlocks = 1e12 - mult * cycleBlocks - startBlocks;
console.log("tail b/h", tailBlocks);
const tailHeight = heights
  .slice(startBlocks, startBlocks + tailBlocks)
  .reduce((a, b) => a + b);
const part2 = startHeight + mult * cycleHeight + tailHeight + 1;
console.log("#2:", part2);
