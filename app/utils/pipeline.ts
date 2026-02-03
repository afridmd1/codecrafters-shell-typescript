import { spawn } from "node:child_process";
import { PassThrough } from "node:stream";
import type { Interface } from "node:readline";

//utilities
import { builtIns } from "./utilityData.ts";

const executeBuiltInPipeline = (
  cmd: string,
  args: string[],
  outputStream: NodeJS.WritableStream,
) => {
  //to be implemented
  switch (cmd) {
    case "echo": {
      outputStream.write(args.join(" ") + "\n");
      break;
    }
    case "pwd": {
      outputStream.write(process.cwd() + "\n");
      break;
    }
    case "type": {
      for (const arg of args) {
        if (builtIns.has(arg)) {
          outputStream.write(`${arg} is a shell builtin\n`);
        } else {
          outputStream.write(`${arg} not found\n`);
        }
      }
      break;
    }
    default: {
    }
  }
};

const executePipeline = (rl: Interface, input: string) => {
  const pipelineParts = input.split("|").map((part) => part.trim());
  const stages = pipelineParts.map((part) => {
    const [cmd, ...args] = part.split(" ").filter((s) => s.length > 0);
    return { cmd, args };
  });
  const pipes = [];

  for (let i = 0; i < stages.length - 1; i++) {
    pipes.push(new PassThrough());
  }

  let lastProcess: ReturnType<typeof spawn> | null = null;

  for (let i = 0; i < stages.length; i++) {
    const [cmd, args] = stages[i] ? [stages[i].cmd, stages[i].args] : ["", []];

    const inputStream = i > 0 ? pipes[i - 1] : null;
    const outputStream = i < pipes.length ? pipes[i] : null;

    if (builtIns.has(cmd)) {
      executeBuiltInPipeline(cmd, args, outputStream ?? process.stdout);
      if (outputStream) {
        outputStream.end();
      }
    } else {
      const process = spawn(cmd, args, {
        stdio: [
          inputStream ? "pipe" : "inherit",
          outputStream ? "pipe" : "inherit",
          "inherit",
        ],
      });

      lastProcess = process;

      if (inputStream) {
        inputStream.pipe(process.stdin!);
      }

      if (outputStream) {
        process.stdout?.pipe(outputStream!);
      }
    }
  }

  const lastStage = stages[stages.length - 1];

  if (builtIns.has(lastStage.cmd)) {
    rl.prompt();
  } else {
    lastProcess?.on("close", () => {
      rl.prompt();
    });
  }
};

export default executePipeline;
