import { createInterface } from "node:readline";
import type { Interface } from "node:readline";

const rl: Interface = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();

rl.on("line", (line: string = "") => {
  const input = line.trim();

  if (input === "exit") {
    rl.close();
    return;
  }

  if (input) {
    console.log(`${input}: command not found`);
  }

  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
