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
  const input1 = input.split("|")[0].trim(),
    cmd1 = input1.split(" "),
    args1 = cmd1.slice(1);
  const input2 = input.split("|")[1].trim(),
    cmd2 = input2.split(" "),
    args2 = cmd2.slice(1);

  let isLeftBuiltIn = false,
    isRightBuiltIn = false;

  if (builtIns.has(cmd1[0])) isLeftBuiltIn = true;
  if (builtIns.has(cmd2[0])) isRightBuiltIn = true;

  /*
  built-in | built-in
  built-in | external
  external | built-in
  external | external
  */

  const pipeline = new PassThrough();

  if (isLeftBuiltIn) {
    executeBuiltInPipeline(cmd1[0], args1, pipeline);
    pipeline.end();

    if (isRightBuiltIn) {
      executeBuiltInPipeline(cmd2[0], args2, process.stdout);
      rl.prompt();
      return;
    } else {
      const rightProcess = spawn(cmd2[0], args2, {
        stdio: ["pipe", "inherit", "inherit"],
      });
      pipeline.pipe(rightProcess.stdin!);

      rightProcess.on("exit", () => {
        rl.prompt();
      });
    }
  } else {
    const leftProcess = spawn(cmd1[0], args1, {
      stdio: ["inherit", "pipe", "inherit"],
    });

    leftProcess.stdout!.pipe(pipeline);

    if (isRightBuiltIn) {
      executeBuiltInPipeline(cmd2[0], args2, process.stdout);
      pipeline.end();
      rl.prompt();
    } else {
      const rightProcess = spawn(cmd2[0], args2, {
        stdio: ["pipe", "inherit", "inherit"],
      });

      pipeline.pipe(rightProcess.stdin!);

      rightProcess.on("exit", () => {
        rl.prompt();
      });
    }
  }
};

export default executePipeline;
