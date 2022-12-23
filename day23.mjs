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
  }

  propose(positions) {
    // check if alone, and do not move
    if (
      ALLDIR.every(([dx, dy]) => {
        const [cx, cy] = [this.x + dx, this.y + dy];
        return !positions.has(toKey(cx, cy));
      })
    ) {
      //console.log(`Elf ${toKey(this.x, this.y)} proposes staying put.`);
      this.nextPos = [this.x, this.y];
      this.myDirs.push(this.myDirs.shift());
      return;
    }

    for (let i = 0; i < 4; i++) {
      const dir = this.myDirs[i];
      //console.log("look", dir);
      if (
        LOOK[dir].every(([dx, dy]) => {
          const [cx, cy] = [this.x + dx, this.y + dy];
          return !positions.has(toKey(cx, cy));
        })
      ) {
        const [dx, dy] = LOOK[dir][1];
        this.nextPos = [this.x + dx, this.y + dy];
        // console.log(
        //   `Elf ${toKey(this.x, this.y)} proposes ${dir} to ${this.nextPos}`
        // );
        break;
      } else {
        //console.log(`Elf ${toKey(this.x, this.y)} blocked ${dir} `);
      }
    }
    if (!this.nextPos) {
      this.nextPos = [this.x, this.y];
    }
    this.myDirs.push(this.myDirs.shift());
  }

  move() {
    if (this.nextPos) {
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
  for (let y = limits.y1; y <= limits.y2; y++) {
    let show = "";
    for (let x = limits.x1; x <= limits.x2; x++) {
      show += positions.has(toKey(x, y)) ? "#" : ".";
      if (!positions.has(toKey(x, y))) count++;
    }
    console.log(show);
  }
  console.log();
  return count;
}

const elves = layout.map((pos) => new Elf(...pos));
let positions = new Set(layout.map(([x, y]) => toKey(x, y)));

let result = 0;
for (let i = 0; i < 10; i++) {
  console.log(i + 1);
  // elves decide where they are going
  let dupeCheck = new Map();
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

  result = showLayout(positions);
}

console.log("#1", result);
