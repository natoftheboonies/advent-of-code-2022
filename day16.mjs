"use strict";

import { promises } from "fs";

const sample = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

let puzzle = sample;

if (false) {
  const dataBuf = await promises.readFile("input16");
  puzzle = dataBuf.toString();
}

const lines = puzzle.split("\n").filter((line) => Boolean(line));
const rooms = new Map();
let usefulValves = 0;
lines.forEach((line) => {
  let valve = line.substring(6, 8);
  let rate = Number(line.substring(line.indexOf("=") + 1, line.indexOf(";")));
  let tunnels = line
    .substring(line.indexOf(" ", line.indexOf("valve")) + 1)
    .split(",")
    .map((t) => t.trim());
  rooms.set(valve, [rate, tunnels]);
  if (rate > 0) usefulValves++;
  //console.log(valve, rate, tunnels);
});

console.log(usefulValves);
console.assert(rooms.size == lines.length);

// how many paths in 30m?
// store cave, time, score
let queue = [["AA", 30, 0, []]];

let max_score = 0;

while (queue.length > 0) {
  let [pos, time, score, valvesOn] = queue.shift();
  //console.log(pos, time, score);
  let [rate, tunnels] = rooms.get(pos);
  if (time >= 0) {
    if (valvesOn.length == usefulValves) continue;
    // move
    for (const tunnel of tunnels) {
      queue.push([tunnel, time - 1, score, valvesOn]);
    }
    // or we could open...
    if (rate > 0 && valvesOn.indexOf(pos) == -1) {
      time--;
      score += rate * time;
      const newValves = valvesOn.slice();
      newValves.push(pos);
      //valvesOn.add(pos);
      if (score > max_score) max_score = score;
      // move
      if (newValves.length < usefulValves) {
        for (const tunnel of tunnels) {
          //console.log(tunnel, time - 1, score);
          queue.push([tunnel, time - 1, score, newValves]);
        }
      }
    }
    //    console.log(queue.length);
  }
}

console.log(max_score);
