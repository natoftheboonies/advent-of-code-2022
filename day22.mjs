import { promises } from "fs";

const dataBuf = await promises.readFile("input22");
let puzzle = dataBuf.toString();

const [part1, part2] = puzzle.split("\n\n");

let maze = part1.split("\n").map((line) => line.split(""));

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

let pos = [maze[0].indexOf("."), 0];
let orient = 0;

function findTopEdge(x, y) {
  for (let ty = y; ty > 0; ty--) {
    if (maze[ty].length <= x || maze[ty][x] === " ") return ty + 1;
  }
  return 0;
}

function findBottomEdge(x, y) {
  for (let ty = y; ty < maze.length; ty++) {
    if (maze[ty].length <= x || maze[ty][x] === " ") return ty - 1;
  }
  return maze.length - 1;
}

// let's move!
for (let step of path) {
  if (isNaN(step)) {
    if (step === "R") {
      orient += 1;
    } else {
      orient -= 1;
    }
    //https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
    orient += 4;
    orient %= 4;
    continue;
  }

  while (step > 0) {
    step--;
    let [x, y] = pos;
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
    } else {
      // vertical
      const topEdge = findTopEdge(x, y);
      const bottomEdge = findBottomEdge(x, y);
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

const sol1 = (pos[1] + 1) * 1000 + (pos[0] + 1) * 4 + orient;
console.log("#1:", sol1);

// part2, now we got portals!
/*
 12
 3
45
6

1 > 2, 1 ^ 6 (rot 1), 1 < 4 (rot 2), 1 v 3
2 > 5 (rot 2), 2 ^ 6, 2 < 1, 2 v 3 (rot -1)
3 > 2 (rot 1), 3 ^ 1, 3 < 4 (rot 1), 3 v 5
4 > 5, 4 ^ 3 (rot 1), 4 < 1 (rot 2), 4 v 6
5 > 2 (rot 2), 5 ^ 3, 5 < 4, 5 v 6 (rot 1)
6 > 1 (rot -1), 6 ^ 4, 6 < 5 (rot -1), 6 v 2
*/

const corners = {
  1: [50, 0],
  2: [100, 0],
  3: [50, 50],
  4: [0, 100],
  5: [50, 100],
  6: [0, 150],
};

function portal([x, y], orient) {
  switch (orient) {
    case 0: // >
      if (x == corners[5][0]) {
        // 4 or 6 -> 5
        const [dx, dy] = corners[5];
        if (y >= corners[6][1]) {
          // 6 -> 5, appear ^ bottom
          const offset = y - corners[6][1];
          const target = [dx + offset, dy + 49];
          return [target, (orient - 1 + 4) % 4];
        } else {
          // 4 -> 5
          return [[x, y], orient];
        }
      } else if (x == corners[2][0]) {
        // 1 or 3 or 5 -> 2
        const [dx, dy] = corners[2];
        if (y >= corners[5][1]) {
          // 5 -> 2
          const offset = y - corners[5][1];
          const target = [dx + 49, dy + 49 - offset];
          return [target, (orient + 2) % 4];
        } else if (y > corners[3][1]) {
          // 3 -> 2
          const offset = y - corners[3][1];
          const target = [dx + offset, dy + 49];
          return [target, (orient - 1 + 4) % 4];
        } else {
          // 1 -> 2
          return [[x, y], orient];
        }
      } else {
        // 2 -> 5
        const [dx, dy] = corners[5];
        const offset = y - corners[2][1];
        const target = [dx + 49, dy + 49 - offset];
        return [target, (orient + 2) % 4];
      }
      break;
    case 1: // v
      if (y == corners[3][1]) {
        const [dx, dy] = corners[3];
        // 1 or 2 -> 3
        if (x < corners[2][0]) {
          // 1 -> 3
          return [[x, y], orient];
        } else {
          // 2 -> 3
          const offset = x - corners[2][0];
          const target = [dx + 49, dy + offset];
          return [target, (orient + 1) % 4];
        }
      } else if (y == corners[5][1]) {
        // 3 -> 5
        return [[x, y], orient];
      } else if (y == corners[6][1]) {
        // 4 or 5 -> 6
        const [dx, dy] = corners[6];
        if (x >= corners[5][0]) {
          // 5 -> 6
          const offset = x - corners[5][0];
          const target = [dx + 49, dy + offset];
          return [target, (orient + 1) % 4];
        } else {
          // 4 -> 6
          return [[x, y], orient];
        }
      } else {
        // 6 -> 2
        const [dx, dy] = corners[2];
        const offset = x - corners[6][0];
        const target = [dx + offset, dy];
        return [target, orient];
      }
      break;
    case 2: // <
      if (x == corners[2][0] - 1) {
        // 2 -> 1
        return [[x, y], orient];
      } else if (x == corners[1][0] - 1) {
        const [dx, dy] = corners[4];
        // 1, 3, 5 -> 4
        if (y >= corners[5][1]) {
          // 5 -> 4
          return [[x, y], orient];
        } else if (y >= corners[3][1]) {
          // 3 -> 4
          const offset = y - corners[3][1];
          const target = [dx + offset, dy];
          return [target, (orient - 1 + 4) % 4];
        } else {
          // 1 -> 4
          const offset = y - corners[1][1];
          const target = [dx, dy + 49 - offset];
          return [target, (orient + 2) % 4];
        }
      } else {
        const [dx, dy] = corners[1];
        // 4, 6 -> 1
        if (y >= corners[6][1]) {
          // 6 -> 1
          const offset = y - corners[6][1];
          const target = [dx + offset, dy];
          return [target, (orient - 1 + 4) % 4];
        } else {
          // 4 -> 1
          const offset = y - corners[4][1];
          const target = [dx, dy + 49 - offset];
          return [target, (orient + 2) % 4];
        }
      }
      break;
    case 3: // ^
      if (y == corners[1][1] - 1) {
        // 1 or 2 -> 6
        const [dx, dy] = corners[6];
        if (x < corners[2][0]) {
          // 1 -> 6
          const offset = x - corners[1][0];
          const target = [dx, dy + offset];
          return [target, (orient + 1) % 4];
        } else {
          // 2 -> 6
          const offset = x - corners[2][0];
          const target = [dx + offset, dy + 49];
          return [target, orient];
        }
      } else if (y == corners[3][1] - 1) {
        // 3 -> 1, no portal
        return [[x, y], orient];
      } else if (y == corners[5][1] - 1) {
        // 4 or 5 -> 3
        const [dx, dy] = corners[3];
        if (x > corners[5][0]) {
          // 5 -> 3, no portal
          return [[x, y], orient];
        } else {
          // 4 -> 3
          const offset = x - corners[4][0];
          const target = [dx, dy + offset];
          return [target, (orient + 1) % 4];
        }
      } else {
        // 6 -> 4, no portal
        return [[x, y], orient];
      }
      break;
  }
}

// reset!
pos = [maze[0].indexOf("."), 0];
orient = 0;

// let's move!
for (let step of path) {
  if (isNaN(step)) {
    if (step === "R") {
      orient += 1;
    } else {
      orient -= 1;
    }
    orient += 4;
    orient %= 4;
    continue;
  }

  while (step > 0) {
    step--;
    let [x, y] = pos;
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
      continue; // blocked
    }

    if (orient % 2 == 0) {
      // horizontal
      const leftEdge =
        maze[ty].lastIndexOf(" ") == -1 ? 0 : maze[ty].lastIndexOf(" ") + 1;
      const rightEdge = maze[ty].length - 1;
      if (tx < leftEdge || tx > rightEdge) {
        const [npos, norient] = portal([tx, ty], orient);
        if (maze[npos[1]][npos[0]] === "#") continue;
        pos = npos;
        orient = norient;
      } else {
        pos = [tx, ty];
      }
    } else {
      // vertical
      const topEdge = findTopEdge(x, y);
      const bottomEdge = findBottomEdge(x, y);
      if (ty < topEdge || ty > bottomEdge) {
        const [npos, norient] = portal([tx, ty], orient);
        if (maze[npos[1]][npos[0]] === "#") continue;
        pos = npos;
        orient = norient;
      } else {
        pos = [tx, ty];
      }
    }
  }
}

const sol2 = (pos[1] + 1) * 1000 + (pos[0] + 1) * 4 + orient;
console.log("#2:", sol2);
