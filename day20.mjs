import { promises } from "fs";

let sample = `1
2
-3
3
-2
0
4`;

class Item {
  val;
  next;
  prior;
  constructor(val) {
    this.val = val;
  }

  insert(val) {
    let priorNext = this.next;
    const inserted = new Item(val);
    this.next = inserted;
    inserted.prior = this;
    inserted.next = priorNext;
    return inserted;
  }

  status() {
    console.log("whereami?", this.prior?.val, this.val, this.next?.val);
  }

  move(loop) {
    let move = this.val;
    // reduce move by size of the list (loop - 1) excluding ourself
    if (this.val < 0) {
      let left = Math.abs(move);
      if (left > loop - 1) left = left % (loop - 1);
      move = loop - 1 - left;
    } else {
      if (move > loop - 1) move = move % (loop - 1);
    }

    // a, b, c, d => a, c, b, d
    for (let i = 0; i < move; i++) {
      let prior = this.prior; // a
      // this = b
      let next = this.next; // c
      let newNext = next.next; // d
      // a, c
      prior.next = next; // a -> c
      next.prior = prior; // a <- c
      // b, d
      this.next = newNext; // b -> d
      newNext.prior = this; // b <- d
      // c, b
      this.prior = next; // c <- b
      next.next = this; // c -> b
    }
  }

  getIndex(count) {
    if (count === 0) return this.val;
    return this.next.getIndex(count - 1);
  }
}

let puzzle = sample;

if (true) {
  const dataBuf = await promises.readFile("input20");
  puzzle = dataBuf.toString();
}
const signal = puzzle
  .split("\n")
  .filter((line) => Boolean(line))
  .map((line) => Number(line));

function buildStack(mult = 1) {
  const stack = [];
  let current = new Item(signal.at(0) * mult);
  const start = current;
  let zero;
  stack.push(current);
  signal.slice(1).forEach((val) => {
    current = current.insert(val * mult);
    stack.push(current);
    if (val === 0) zero = current;
  });
  // hook up the circle
  current.next = start;
  start.prior = current;
  return [stack, zero];
}

function part1() {
  const [stack, zero] = buildStack();
  const loop = stack.length;

  let workingStack = stack.slice();
  while (workingStack.length > 0) {
    const moveMe = workingStack.shift();
    moveMe.move(loop);
  }

  const targets = [1000, 2000, 3000].map((x) => x % loop);
  const part1 = targets.reduce((a, t) => a + zero.getIndex(t), 0);
  return part1;
}

console.log("#1:", part1());

function part2() {
  const key = 811589153;

  const [stack, zero] = buildStack(key);
  const loop = stack.length;

  for (let i = 0; i < 10; i++) {
    let workingStack = stack.slice();
    while (workingStack.length > 0) {
      const moveMe = workingStack.shift();
      moveMe.move(loop);
    }
  }

  const targets = [1000, 2000, 3000].map((x) => x % loop);
  const part2 = targets.reduce((a, t) => a + zero.getIndex(t), 0);
  return part2;
}

console.log("#2:", part2());
