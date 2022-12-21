import { promises } from "fs";

const sample = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

let puzzle = sample;

if (true) {
  const dataBuf = await promises.readFile("input21");
  puzzle = dataBuf.toString();
}

const ops = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

const root = "root";

function parsePuzzle(puzzle) {
  const queue = new Map();
  puzzle
    .split("\n")
    .filter((line) => Boolean(line))
    .forEach((rule) => {
      const [monkey, equ] = rule.split(": ");
      if (equ.includes(" ")) {
        const [a, op, b] = equ.split(" ");
        if (!op in ops) {
          console.error("unexpected op", op);
        }
        queue.set(monkey, [a, ops[op], b]);
      } else {
        const a = Number(equ);
        queue.set(monkey, a);
      }
    });
  return queue;
}

function processQueue(queue, resolved) {
  let changed = false;
  for (const monkey of queue.keys()) {
    const rhs = queue.get(monkey);
    if (isFinite(rhs)) {
      resolved.set(monkey, rhs);
      queue.delete(monkey);
      changed = true;
    } else {
      const [a, func, b] = rhs;
      if (resolved.has(a) && resolved.has(b)) {
        const result = func(resolved.get(a), resolved.get(b));
        resolved.set(monkey, result);
        queue.delete(monkey);
        changed = true;
      }
    }
  }
  return changed;
}

function part1() {
  const queue = parsePuzzle(puzzle);
  const resolved = new Map();

  // loop over equations until they are all resolved
  while (!resolved.has(root)) {
    processQueue(queue, resolved);
  }

  return resolved.get(root);
}

console.log("#1", part1());

// part 2

// inverse equations for missing a or b
const invOps = {
  // x = a+b: b = x-a, a = x-b
  "+": [(a, x) => x - a, (b, x) => x - b],
  // x = a-b: b = a-x, a = x+b
  "-": [(a, x) => a - x, (b, x) => x + b],
  // x = a*b: b = x/a, a = x/b
  "*": [(a, x) => x / a, (b, x) => x / b],
  // x = a/b: b = a/x, a = x*b,
  "/": [(a, x) => a / x, (b, x) => x * b],
};

// we already resolved operations, so unresolve them
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

function part2() {
  const unknown = "humn";

  const queue = parsePuzzle(puzzle);
  queue.delete(unknown);
  const resolved = new Map();
  // solve whatever we have, with humn unknown
  let changed = true;
  while (changed) {
    changed = processQueue(queue, resolved);
  }

  // part2: root is now a == b, so if we have a or b, set the other
  const [a, _, b] = queue.get(root);
  if (resolved.get(a)) {
    resolved.set(b, resolved.get(a));
    queue.delete(root);
  } else if (resolved.get(b)) {
    resolved.set(a, resolved.get(b));
    queue.delete(root);
  }

  // solve until we know everything
  while (queue.size > 0) {
    for (const monkey of queue.keys()) {
      const rhs = queue.get(monkey);

      // if we have the answer for this equation, solve for the missing value
      if (resolved.has(monkey)) {
        const [a, func, b] = rhs;
        const [resolveB, resolveA] = invOps[getKeyByValue(ops, func)];

        if (resolved.has(a)) {
          resolved.set(b, resolveB(resolved.get(a), resolved.get(monkey)));
        } else if (resolved.has(b)) {
          resolved.set(a, resolveA(resolved.get(b), resolved.get(monkey)));
        } else console.error("stuck");
        queue.delete(monkey);
      }
    }
  }

  return resolved.get(unknown);
}

console.log("#2", part2());
