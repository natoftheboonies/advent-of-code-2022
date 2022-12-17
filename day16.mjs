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

if (true) {
  const dataBuf = await promises.readFile("input16");
  puzzle = dataBuf.toString();
}

const lines = puzzle.split("\n").filter((line) => Boolean(line));

// parse into map of room -> {room, rate, edges}
const rooms = new Map(
  lines.map((line) => {
    let valve = line.substring(6, 8);
    let rate = Number(line.substring(line.indexOf("=") + 1, line.indexOf(";")));
    let tunnels = line
      .substring(line.indexOf(" ", line.indexOf("valve")) + 1)
      .split(",")
      .map((t) => t.trim());
    return [
      valve,
      {
        valve,
        rate,
        edges: Object.fromEntries(tunnels.map((tunnel) => [tunnel, 1])),
      },
    ];
  })
);

const start = "AA";

console.assert(rooms.size == lines.length);

// porting https://www.reddit.com/r/adventofcode/comments/zn6k1l/comment/j0gqhgs/?context=3
// build a map of useful rooms to an object of distance to other rooms
// AA => {DD: 1, BB: 1, CC: 2, EE: 2, JJ: 2, HH: 5}

function findBestPaths(goal) {
  const q = [[0, goal]];
  const bestPaths = Object.fromEntries([[goal, 0]]);
  while (q.length > 0) {
    const [priorCost, current] = q.pop();
    for (const [point, cost] of Object.entries(rooms.get(current).edges)) {
      const newCost = priorCost + cost;
      if (!(point in bestPaths) || newCost < bestPaths[point]) {
        bestPaths[point] = newCost;
        q.push([newCost, point]);
      }
    }
  }
  // remove records for useless rooms
  for (const point in bestPaths) {
    if (rooms.get(point).rate == 0) delete bestPaths[point];
  }
  return bestPaths;
}

// for start room and other rooms with a useful valve,
// update distance (time) to all other useful rooms.
for (const room of rooms.values()) {
  if (room.valve == start || room.rate > 0) {
    room.edges = findBestPaths(room.valve);
  }
}

// starting at `room` generate all paths through `visit` rooms valid for remaining time
function* generatePaths(room, visit, done, time) {
  for (const next of visit) {
    const cost = rooms.get(room).edges[next] + 1;
    if (cost < time) {
      for (let value of generatePaths(
        next,
        visit.filter((v) => v != next),
        done.concat([next]),
        time - cost
      )) {
        yield value;
      }
    }
  }
  yield done;
}

// for a given path, compute the pressure released
function pressureForPath(path, time) {
  let pressure = 0;
  let room = start;
  for (const step of path) {
    // move to room and open valve (+1)
    const cost = rooms.get(room).edges[step] + 1;
    time -= cost;
    console.assert(time > 0);
    // add remaining time for this room
    pressure += time * rooms.get(step).rate;
    room = step;
  }
  return pressure;
}

// only visiting rooms with useful valves
const visit = [...rooms.values()]
  .filter((room) => room.rate > 0)
  .map((room) => room.valve);

// part1

let time = 30;
let maxPressure = 0;
for (const path of generatePaths(start, visit, [], time)) {
  const pressure = pressureForPath(path, time);
  if (pressure > maxPressure) maxPressure = pressure;
}

console.log("#1", maxPressure);

// part2

time = 26;
// build a database of [pressure, path] for all possible paths
const database = [];
for (const path of generatePaths(start, visit, [], time)) {
  const result = pressureForPath(path, time);
  database.push([result, path]);
}

// sort high to low
database.sort((a, b) => b[0] - a[0]);
maxPressure = 0;
// search for two paths with no intersecting valves
for (const [pressure, myPath] of database) {
  if (pressure < maxPressure / 2) break;
  for (const [elephantPressure, elephantPath] of database) {
    // if no intersection, valid combo
    if (!elephantPath.some((room) => myPath.includes(room))) {
      const totalPressure = pressure + elephantPressure;
      if (totalPressure > maxPressure) maxPressure = totalPressure;
    }
  }
}

console.log("#2", maxPressure);
