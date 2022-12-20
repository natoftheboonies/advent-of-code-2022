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
    this.next = this;
  }

  // a.insert(b) -> a
  // a -> b -> a
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
    if (this.val < 0) {
      let left = Math.abs(move);
      if (left > loop - 1) left = left % (loop - 1);
      //console.log("moving", this.val, "reverse", move);
      move = loop - 1 - left;
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
    //this.status();
  }

  getIndex(count) {
    if (count === 0) return this.val;
    return this.next.getIndex(count - 1);
  }

  printAll() {
    const result = [];
    const start = this;
    result.push(start.val);
    let cur = this.next;
    while (cur !== start) {
      result.push(cur.val);
      cur = cur.next;
    }
    return result;
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

//console.log(signal);

function part1() {
  const stack = [];
  let current = new Item(signal.at(0));
  const start = current;
  let zero;
  stack.push(current);
  signal.slice(1).forEach((val) => {
    current = current.insert(val);
    stack.push(current);
    if (val === 0) zero = current;
  });
  // hook up the circle
  current.next = start;
  start.prior = current;

  const loop = stack.length;

  // part 1

  let workingStack = stack.slice();
  //console.log(current);
  while (workingStack.length > 0) {
    const moveMe = workingStack.shift();
    //console.log("move", moveMe.val);
    moveMe.move(loop);
  }

  //zero.status();
  //console.log("fromZero:", zero.printAll());
  //console.log("loop", loop);
  const targets = [1000, 2000, 3000].map((x) => x % loop);
  //console.log(targets);
  // console.log(
  //   "targets",
  //   targets.map((t) => zero.getIndex(t))
  // );
  const part1 = targets.reduce((a, t) => a + zero.getIndex(t), 0);
  console.log("#1:", part1); // 15950 too high
}

part1();
// part 2

const key = 811589153;

//stack.forEach((x) => (x.val *= key));
//console.log("init", zero.printAll());
