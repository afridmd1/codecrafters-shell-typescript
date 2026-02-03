import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// TODO: Uncomment the code below to pass the first stage
rl.question("$ ", (line: string) => {
  const input = line.trim();

  if (line) {
    console.log(`${input}: command not found`);
  }

  rl.close();
});
