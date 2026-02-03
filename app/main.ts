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

  const parts = input.split(" ");
  const command = parts[0];
  const args = parts.slice(1);

  if (command === "exit") {
    rl.close();
    return;
  }

  if (command === "echo") {
    console.log(args.join(" "));
    rl.prompt();
    return;
  }

  if (command) {
    console.log(`${input}: command not found`);
  }

  rl.prompt();
});

rl.on("close", () => {
  process.exit(0);
});
