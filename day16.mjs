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

const nodes = new Object();
const edges = new Object();

const rooms = lines.map((line) => {
  let valve = line.substring(6, 8);
  let rate = Number(line.substring(line.indexOf("=") + 1, line.indexOf(";")));
  let tunnels = line
    .substring(line.indexOf(" ", line.indexOf("valve")) + 1)
    .split(",")
    .map((t) => t.trim());
  nodes[valve] = rate;
  edges[valve] = Object.fromEntries(tunnels.map((tunnel) => [tunnel, 1]));
  return [valve, rate, tunnels];
  //console.log(valve, rate, tunnels);
});

console.assert(rooms.length == lines.length);

// porting https://www.reddit.com/r/adventofcode/comments/zn6k1l/comment/j0gqhgs/?context=3
// build a map of useful rooms to a map of distance to other rooms
// {AA: {DD: 1, BB: 1, CC: 2, EE: 2, JJ: 2, HH: 5}

function findBestPaths(edges, goal) {
  const q = [[0, goal]];
  const path_lengths = Object.fromEntries([[goal, 0]]);
  while (q.length > 0) {
    const [cost, current] = q.pop();
    for (const [point, point_cost] of Object.entries(edges[current])) {
      if (!(point in path_lengths) || cost + point_cost < path_lengths[point]) {
        path_lengths[point] = cost + point_cost;
        q.push([cost + point_cost, point]);
      }
    }
  }
  for (const point in path_lengths) {
    if (nodes[point] == 0) delete path_lengths[point];
  }
  return path_lengths;
}

function* all_orders(distances, node, todo, done, time) {
  for (const next_node of todo) {
    //console.log("todo", todo, done);
    const cost = distances[node][next_node] + 1;
    if (cost < time) {
      for (let value of all_orders(
        distances,
        next_node,
        new Set([...todo].filter((x) => x != next_node)),
        done.concat([next_node]),
        time - cost
      ))
        yield value;
    }
  }
  yield done;
}

function run_order(costs, start_node, order, t) {
  let release = 0;
  let current = start_node;
  for (const node of order) {
    if (!(current in costs) || !(node in costs[current])) {
      console.log("no", nodes);
      console.error("urk", current, node);
    }
    const cost = costs[current][node] + 1;
    t -= cost;
    console.assert(t > 0);
    release += t * nodes[node];
    current = node;
  }
  return release;
}

const foo = Object.fromEntries(
  Object.keys(nodes)
    .filter((valve) => valve == "AA" || nodes[valve] > 0)
    .map((valve) => [valve, findBestPaths(edges, valve)])
);
//console.log(foo);

const working_nodes = new Set();
for (const node in nodes) {
  if (nodes[node] > 0) working_nodes.add(node);
}

const start_node = "AA";
const p1_orders = all_orders(foo, start_node, working_nodes, [], 30);
let max_result = 0;
for (const order of p1_orders) {
  //console.log(order);
  //max_result++;
  const result = run_order(foo, start_node, order, 30);
  if (result > max_result) max_result = result;
}

console.log("#1", max_result);
