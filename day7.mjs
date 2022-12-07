import { promises } from "fs";

const sample = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

let puzzle = sample;
const dataBuf = await promises.readFile("input7");
puzzle = dataBuf.toString();
const io = puzzle.split("\n").filter((line) => Boolean(line));

const stack = new Array();
const dirSize = new Map(); // path -> size
io.forEach((line) => {
  // no-op
  if (line == "$ ls" || line.startsWith("dir")) return;

  // change directory
  if (line.startsWith("$ cd")) {
    const dir = line.slice("$ cd ".length);
    if (dir == "..") stack.pop();
    else stack.push(dir);
    return;
  }

  // add file size to all paths in stack
  const bytes = Number(line.split(" ")[0]);
  let path = "";
  for (const d of stack) {
    path += d;
    if (path != "/") path += "/";
    dirSize.set(path, (dirSize.get(path) ?? 0) + bytes);
  }
});

let part1 = 0;
let part2;
const need = dirSize.get("/") - (70_000_000 - 30_000_000);
for (const size of dirSize.values()) {
  // part1: total size of directories <= 100_000
  if (size <= 100_000) part1 += size;
  // part2: smallest directory greater than need
  if (size >= need && (isNaN(part2) || size < part2)) part2 = size;
}
console.log("#1:", part1);
console.log("#2:", part2);
