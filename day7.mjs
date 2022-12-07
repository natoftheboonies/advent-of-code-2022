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

//console.log(io.length);
const stack = new Array();
const filePositions = new Map();
const fileBytes = new Map();
io.forEach((line) => {
  // no-op
  if (line == "$ ls" || line.startsWith("dir")) return;

  // change directory
  if (line.startsWith("$ cd")) {
    const dir = line.slice("$ cd ".length);
    if (dir == "..") {
      stack.pop();
    } else {
      // record directory location
      filePositions.set(dir, stack.at(-1));
      stack.push(dir);
    }
  } else {
    // record file position and size
    const [bytes, filename] = line.split(" ");
    filePositions.set(filename, stack.at(-1));
    fileBytes.set(filename, Number(bytes));
  }
});

//console.log(stack);
//console.log(filePositions);
//console.log(fileBytes);
const dirs = new Set([...filePositions.values()].filter((e) => Boolean(e)));
//console.log(dirs);

let part1 = 0;

function dirSum(dir) {
  // find contents of dir, files and other dirs
  let dirContents = new Array();
  filePositions.forEach((value, key) => {
    if (dir == value) dirContents.push(key);
  });
  //console.log(dir, "has", dirContents);
  let result = 0;
  result += dirContents.reduce((total, file) => {
    //console.log("red", total, file);
    return total + (fileBytes.has(file) ? fileBytes.get(file) : dirSum(file));
  }, 0);
  return result;
}

for (const dir of dirs) {
  const amt = dirSum(dir);
  console.log(dir, amt);
  if (amt <= 100_000) part1 += amt;
}
console.log("#1: ", part1); // 849976 low
