import { spawn } from "node:child_process";
import type { Interface } from "node:readline";

const executePipeline = (rl: Interface, input: string) => {
  const pipeline1 = input.split("|")[0].trim().split(" ");
  const pipeline2 = input.split("|")[1].trim().split(" ");

  const leftProcess = spawn(pipeline1[0], pipeline1.slice(1), {
    stdio: ["ignore", "pipe", "inherit"],
  });

  const rightProcess = spawn(pipeline2[0], pipeline2.slice(1), {
    stdio: ["pipe", "inherit", "inherit"],
  });

  leftProcess.stdout.pipe(rightProcess.stdin);

  rightProcess.on("exit", () => {
    rl.prompt();
  });
};

export default executePipeline;
