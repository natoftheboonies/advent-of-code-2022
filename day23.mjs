import { promises } from "fs";

let sample = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

let puzzle = sample;

if (true) {
  const dataBuf = await promises.readFile("input23");
  puzzle = dataBuf.toString();
}
const layout = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .map((line, y) =>
    line
      .split("")
      .reduce(
        (elves, char, x) => (char === "#" ? elves.concat([[x, y]]) : elves),
        []
      )
  )
  .flat();

const LOOK = {
  N: [
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
  S: [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
  W: [
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ],
  E: [
    [1, -1],
    [1, 0],
    [1, 1],
  ],
};

// move is LOOK[x][1]

const DIRS = ["N", "S", "W", "E"];

const ALLDIR = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const toKey = (x, y) => `${x},${y}`;
const fromKey = (str) => str.split(",").map((t) => +t);

class Elf {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.myDirs = DIRS.slice();
    this.moved = false;
  }

  propose(positions) {
    // check if alone, and do not move
    if (
      ALLDIR.every(([dx, dy]) => {
        const [cx, cy] = [this.x + dx, this.y + dy];
        return !positions.has(toKey(cx, cy));
      })
    ) {
      this.moved = false;
    } else {
      for (let i = 0; i < 4; i++) {
        const dir = this.myDirs[i];
        if (
          LOOK[dir].every(([dx, dy]) => {
            const [cx, cy] = [this.x + dx, this.y + dy];
            return !positions.has(toKey(cx, cy));
          })
        ) {
          const [dx, dy] = LOOK[dir][1];
          this.nextPos = [this.x + dx, this.y + dy];
          break;
        }
      }
    }
    if (!this.nextPos) {
      this.nextPos = [this.x, this.y];
    }
    // the first direction considered goes to the end.
    this.myDirs.push(this.myDirs.shift());
  }

  move() {
    this.moved = false;
    if (this.nextPos) {
      if (this.nextPos[0] !== this.x || this.nextPos[1] !== this.y) {
        this.moved = true;
      }
      [this.x, this.y] = this.nextPos;

      this.nextPos = undefined;
    }
    return toKey(this.x, this.y);
  }
}

function showLayout(positions) {
  let count = 0;
  const limits = [...positions].reduce(
    (lim, key) => {
      const elf = fromKey(key);
      lim.x1 = Math.min(elf[0], lim.x1);
      lim.x2 = Math.max(elf[0], lim.x2);
      lim.y1 = Math.min(elf[1], lim.y1);
      lim.y2 = Math.max(elf[1], lim.y2);
      return lim;
    },
    { x1: Infinity, x2: -Infinity, y1: Infinity, y2: -Infinity }
  );
  const area =
    (limits.x2 - limits.x1 + 1) * (limits.y2 - limits.y1 + 1) - positions.size;
  return area;
  console.log(area);
  for (let y = limits.y1; y <= limits.y2; y++) {
    let show = "";
    for (let x = limits.x1; x <= limits.x2; x++) {
      show += positions.has(toKey(x, y)) ? "#" : ".";
      if (!positions.has(toKey(x, y))) count++;
    }
    //console.log(show);
  }
  //console.log();
  return count;
}

const elves = layout.map((pos) => new Elf(...pos));
let positions = new Set(layout.map(([x, y]) => toKey(x, y)));

let part1 = 0;
let part2 = 0;
for (let i = 0; i < 10000; i++) {
  // elves decide where they are going
  let dupeCheck = new Map(); // replace https://www.reddit.com/r/adventofcode/comments/zt6xz5/comment/j1dq8oj/?utm_source=reddit&utm_medium=web2x&context=3
  elves.forEach((elf) => {
    elf.propose(positions);
    const key = toKey(...elf.nextPos);
    dupeCheck.set(key, (dupeCheck.get(key) ?? 0) + 1);
  });

  // elves who would move to the same position do not move
  elves.forEach((elf) => {
    const key = toKey(...elf.nextPos);
    if (dupeCheck.get(key) > 1) {
      elf.nextPos = undefined;
    }
  });
  // elves move
  positions = new Set(elves.map((elf) => elf.move()));

  if (i === 9) {
    part1 = showLayout(positions);
  }
  if (elves.every((elf) => !elf.moved)) {
    part2 = i + 1;
    break;
  }
}

console.log("#1", part1);
console.log("#2", part2);
