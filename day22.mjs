import { promises } from "fs";

let puzzle;

if (true) {
  const dataBuf = await promises.readFile("input22");
  puzzle = dataBuf.toString();
} else {
  const dataBuf = await promises.readFile("sample22");
  puzzle = dataBuf.toString();
}

const [part1, part2] = puzzle.split("\n\n");

let maze = part1.split("\n").map((line, y) =>
  line.split("").map((c, x) => {
    return c;
  })
);

let dist = "";
let path = [];
for (let c of part2) {
  if (isFinite(c)) dist += c;
  else {
    path.push(Number(dist));
    path.push(c);
    dist = "";
  }
}
if (dist.length > 0) path.push(Number(dist)); // last part1 bug!

const moves = {
  0: [1, 0],
  1: [0, 1],
  2: [-1, 0],
  3: [0, -1],
};

const disp = {
  0: ">",
  1: "v",
  2: "<",
  3: "^",
};

let pos = [maze[0].indexOf("."), 0];
let orient = 0;
console.log("start:", pos);

function findTopEdge(x, y) {
  for (let ty = y; ty > 0; ty--) {
    if (maze[ty].length <= x || maze[ty][x] === " ") return ty + 1;
  }
  return 0;
}

// console.assert(findTopEdge(10, 5) == 0);
// console.assert(findTopEdge(7, 5) == 4);
// console.assert(findTopEdge(10, 9) == 0);
// console.assert(findTopEdge(12, 9) == 8);
// console.assert(findTopEdge(7, 7) == 4);

function findBottomEdge(x, y) {
  for (let ty = y; ty < maze.length; ty++) {
    if (maze[ty].length <= x || maze[ty][x] === " ") return ty - 1;
  }
  return maze.length - 1;
}

// console.assert(findBottomEdge(10, 5) == 11);
// console.assert(findBottomEdge(5, 5) == 7);
// console.assert(findBottomEdge(10, 9) == 11);

function printMaze() {
  return maze.forEach((line) => console.log(line.join("")));
}

// let's move!
for (let step of path) {
  //console.log("step", step);
  if (isNaN(step)) {
    if (step === "R") {
      orient += 1;
    } else {
      console.assert(step === "L");
      orient -= 1;
    }
    //https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
    orient %= 4;
    orient += 4;
    orient %= 4;
    maze[pos[1]][pos[0]] = disp[orient];
    continue;
  }

  while (step > 0) {
    step--;
    let [x, y] = pos;
    maze[y][x] = disp[orient];
    const [dx, dy] = moves[orient];
    const tx = x + dx;
    const ty = y + dy;

    if (
      ty >= 0 &&
      ty < maze.length &&
      tx >= 0 &&
      tx < maze[ty].length &&
      maze[ty][tx] === "#"
    ) {
      //console.log("blocked");
      continue; // blocked
    }

    if (orient % 2 == 0) {
      // horizontal
      const leftEdge =
        maze[ty].lastIndexOf(" ") == -1 ? 0 : maze[ty].lastIndexOf(" ") + 1;
      const rightEdge = maze[ty].length - 1;
      if (tx < leftEdge) {
        if (maze[ty][rightEdge] === "#") continue;
        else pos = [rightEdge, ty];
      } else if (tx > rightEdge) {
        if (maze[ty][leftEdge] === "#") continue;
        else pos = [leftEdge, ty];
      } else {
        pos = [tx, ty];
      }
      continue;
    } else {
      console.assert(orient % 2 == 1);
      // vertical
      const topEdge = findTopEdge(x, y);
      const bottomEdge = findBottomEdge(x, y);
      //console.log("edges", topEdge, bottomEdge);
      if (ty < topEdge) {
        if (maze[bottomEdge][tx] === "#") continue;
        else pos = [tx, bottomEdge];
      } else if (ty > bottomEdge) {
        if (maze[topEdge][tx] === "#") continue;
        else pos = [tx, topEdge];
      } else {
        pos = [tx, ty];
      }
    }
  }
}

//printMaze();

console.log("end:", pos, orient);
const sol1 = (pos[1] + 1) * 1000 + (pos[0] + 1) * 4 + orient;
console.log("#1:", sol1);
