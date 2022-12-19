import { time } from "console";
import { promises } from "fs";

const sample = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

let puzzle = sample;

if (true) {
  const dataBuf = await promises.readFile("input19");
  puzzle = dataBuf.toString();
}
const blueprints = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .map((bp) => {
    const values = [...bp.matchAll(/\d+/g)].map((m) => Number(m[0]));
    return {
      idx: values[0],
      costs: [
        [values[1], 0, 0], // ore
        [values[2], 0, 0], // clay
        [values[3], values[4], 0], // obs
        [values[5], 0, values[6]], // geo
      ],
    };
  });

//blueprints.forEach((b) => console.dir(b));

function play(blueprint, gameTime = 24) {
  const startState = {
    min: 0,
    // ore, clay, obs, geo
    resources: [0, 0, 0, 0],
    bots: [1, 0, 0, 0],
  };

  let queue = [startState];
  let maxGeo = 0;
  // compute max requirements to avoid over-collecting resources
  const maxCosts = startState.resources.map((_, i) =>
    Math.max(...blueprint.costs.map((c) => c[i] ?? Infinity))
  );

  while (queue.length > 0) {
    const state = queue.pop();

    // game over
    if (state.min >= gameTime) continue;

    // how many geodes can we open by game over?
    let geosByEnd = state.resources[3] + state.bots[3] * (gameTime - state.min);
    if (geosByEnd > maxGeo) {
      maxGeo = geosByEnd;
    }

    // #4 from https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0tls7a/
    const n = gameTime - state.min;
    if (geosByEnd + (n * (n - 1)) / 2 <= maxGeo) continue;

    // onward
    state.min++;

    // let's build a bot of each type, unless we can't or it takes too long
    for (let i = 0; i < 4; i++) {
      // unless we have enough of this bot (more than 1 + max resources <- found by trial & error)
      if (state.bots[i] > maxCosts[i] || state.resources[i] > maxCosts[i] + 1)
        continue;

      // find longest time to collect enough resources to build the bot
      let nextBotTime = 0;
      // consult bot cost to determine when we can build it
      for (let r = 0; r < 3; r++) {
        const resourceRequired = blueprint.costs[i][r] - state.resources[r];
        let timeForResource = resourceRequired;
        if (timeForResource > 0 && state.bots[r] == 0)
          timeForResource = Infinity; // can't build
        else if (timeForResource > 0)
          timeForResource = Math.ceil(resourceRequired / state.bots[r]);
        if (timeForResource > nextBotTime) {
          nextBotTime = timeForResource;
        }
      }
      // if no bot can be built in time, skip this state.
      if (nextBotTime > gameTime - state.min) continue;

      // next state after building next bot
      const nextState = {
        // fast forward time
        min: state.min + nextBotTime,
        // and resources
        resources: state.bots.map(
          (bot, j) =>
            state.resources[j] -
            // what we spent building this bot
            (blueprint.costs[i][j] ?? 0) +
            // what we gain in the duration (this minute + extra time)
            bot * (1 + nextBotTime)
        ),
        // same as before, plus our new bot
        bots: [...state.bots],
      };
      nextState.bots[i] += 1;
      queue.push(nextState);
    }
  }
  return maxGeo;
}

// part1: sum of index*maxGeo for each blueprint
const part1 = blueprints.reduce(
  (a, blueprint, i) => a + (i + 1) * play(blueprint),
  0
);

console.log("#1:", part1); // 1940 low

// part2: product of maxGeo for first 3 blueprints
const part2 = blueprints
  .slice(0, 3)
  .reduce((a, blueprint) => a * play(blueprint, 32), 1);

console.log("#2:", part2); // 9744 low
