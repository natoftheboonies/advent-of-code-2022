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

// const dataBuf = await promises.readFile("input11");
// puzzle = dataBuf.toString();
const input = puzzle.split("\n\n").filter((line) => Boolean(line));

const monkeys = input.map((monkey) => {
  const lines = monkey.split("\n");
  const id = lines[0].match(/\d+/).at(0);
  const items = new Array(...lines[1].matchAll(/\d+/g)).map((match) =>
    Number(match[0])
  );
  const op = lines[2].charAt(lines[2].indexOf("old ") + 4);
  let right = lines[2].substring(lines[2].indexOf("old ") + 6);
  if (!isNaN(right)) right = Number(right);
  const div = Number(lines[3].match(/\d+/).at(0));
  const ifTrue = Number(lines[4].match(/\d+/).at(0));
  const ifFalse = Number(lines[5].match(/\d+/).at(0));
  return {
    id,
    items,
    op,
    right,
    div,
    ifTrue,
    ifFalse,
    inspected: 0,
  };
});

for (let i = 0; i < 20; i++) {
  monkeys.forEach((monkey) => {
    //console.log("monkey", monkey.id);
    while (monkey.items.length > 0) {
      let item = monkey.items.shift();
      //console.log("inspecting", item);
      monkey.inspected++;
      let level = item;
      let right = item;
      if (monkey.right != "old") right = monkey.right;
      if (monkey.op == "+") level += right;
      else if (monkey.op == "*") level *= right;
      //console.log("worry", level);
      level = Math.floor(level / 3);
      //level = level %= monkey.div;
      //console.log("relax", level);
      const target = level % monkey.div == 0 ? monkey.ifTrue : monkey.ifFalse;
      //console.log("throwing to", target);
      monkeys[target].items.push(level);
    }
    //console.log();
  });
}

// monkeys.forEach((monkey) =>
//   console.log(`Monkey ${monkey.id}: ${monkey.items}`)
// );

const active = [...monkeys].sort((a, b) => b.inspected - a.inspected);
//active.forEach((m) => console.log(m.id, m.inspected));

let part1 = active[0].inspected * active[1].inspected;
console.log("#1:", part1);

// part2 too high 20733120099
