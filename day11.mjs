`use strict;`;
import { promises } from "fs";

let sample = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

let puzzle = sample;
const dataBuf = await promises.readFile("input11");
puzzle = dataBuf.toString();
const input = puzzle.split("\n\n").filter((line) => Boolean(line));

const readMonkeys = (input) =>
  input.map((monkey) => {
    const lines = monkey.split("\n");
    const items = [...lines[1].matchAll(/\d+/g)].map((match) =>
      Number(match[0])
    );
    let right = lines[2].substring(lines[2].indexOf("old ") + 6);
    if (!isNaN(right)) right = Number(right);
    return {
      id: lines[0].match(/\d+/).at(0),
      items,
      op: lines[2].charAt(lines[2].indexOf("old ") + 4),
      right,
      div: Number(lines[3].match(/\d+/).at(0)),
      ifTrue: Number(lines[4].match(/\d+/).at(0)),
      ifFalse: Number(lines[5].match(/\d+/).at(0)),
      inspected: 0,
    };
  });

function runPart(monkeys, rounds, reduceOp) {
  for (let i = 0; i < rounds; i++) {
    monkeys.forEach((monkey) => {
      while (monkey.items.length > 0) {
        let item = monkey.items.shift();
        monkey.inspected++;
        let right = monkey.right == "old" ? item : monkey.right;
        if (monkey.op == "+") item += right;
        else if (monkey.op == "*") item *= right;
        item = reduceOp(item);
        const target = item % monkey.div == 0 ? monkey.ifTrue : monkey.ifFalse;
        monkeys[target].items.push(item);
      }
    });
  }

  let active = [...monkeys].sort((a, b) => b.inspected - a.inspected);
  return active[0].inspected * active[1].inspected;
}

let monkeys = readMonkeys(input);
console.log(
  "#1:",
  runPart(monkeys, 20, (item) => Math.floor(item / 3))
);

// part 2
monkeys = readMonkeys(input);

const allMonkeyDiv = monkeys
  .map((monkey) => monkey.div)
  .reduce((a, b) => a * b, 1);

console.log(
  "#2:",
  runPart(monkeys, 10_000, (item) => item % allMonkeyDiv)
);
