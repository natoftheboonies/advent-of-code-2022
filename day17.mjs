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

function playTetris(gameOver = 2022) {
  const toKey = ([x, y]) => y * 10 + x;

  // store settled rocks and top
  const chamber = new Set();
  let top = -1;

  let i = 0;
  let jet = 0;

  // track heights for cycle state and to replay cycles
  const heights = [];

  const seen = new Map();
  // record [top, i] when in a cycle
  let cycleStats = [];

  while (i < gameOver) {
    const rock = pieces.at(i % 5);
    let pos = [2, top + 4];
    const priorTop = top;

    while (true) {
      const dx = jets.at(jet % jets.length);
      // can jet move rock?
      if (
        dx &&
        rock.every(([x, y]) => {
          let nx = x + pos[0] + dx;
          let ny = y + pos[1];
          let oob = nx > 6 || nx < 0; // out of bounds
          let obs = chamber.has(toKey([nx, ny])); // obstructed
          return !oob && !obs;
        })
      ) {
        pos[0] += dx;
      }
      jet++;

      const dy = -1;
      // can rock drop?
      if (
        rock.every(([x, y]) => {
          const nx = x + pos[0],
            ny = y + pos[1] + dy;
          const oob = ny < 0;
          const obs = chamber.has(toKey([nx, ny]));
          return !oob && !obs;
        })
      ) {
        pos[1] += dy;
      } else {
        // settle rock in chamber
        rock.forEach(([x, y]) => {
          chamber.add(toKey([x + pos[0], y + pos[1]]));
          top = Math.max(top, y + pos[1]);
        });
        break;
      }
    }
    i++;
    // record heights for state detection
    heights.push(top - priorTop);

    if (heights.length > 30) {
      // state is jet, block, last 30 heights
      const situation = `${jet % jets.length},${i % 5},${heights
        .slice(-30)
        .join(",")}`;
      if (seen.has(situation)) {
        // we've been in this state before!
        if (cycleStats.length == 0) {
          // no stats yet, record height and block count
          cycleStats.push([top, i]);
        } else if (seen.get(situation) > 1) {
          // we've cycled, record height and block count
          const [startHeight, startBlocks] = cycleStats[0];

          const cycleHeight = top - startHeight;
          const cycleBlocks = i - startBlocks;

          const mult = Math.floor((gameOver - startBlocks) / cycleBlocks);

          // tail is a partial cycle
          const tailBlocks = gameOver - mult * cycleBlocks - startBlocks;
          const tailHeight = heights
            .slice(startBlocks, startBlocks + tailBlocks)
            .reduce((a, b) => a + b);

          const calcTop = startHeight + mult * cycleHeight + tailHeight;
          return calcTop + 1;
        }
        seen.set(situation, seen.get(situation) + 1);
      } else {
        // record state for later comparison
        seen.set(situation, 1);
      }
    }
  }
  return top + 1; // +1 because 0-indexed
}

console.log("#1:", playTetris());

console.log("#2:", playTetris(1e12));
