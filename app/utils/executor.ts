import fs from "node:fs";
import type { Interface } from "node:readline";

//commands
import exitCommand from "../commands/builtIn/exit.ts";
import clearCommand from "../commands/builtIn/clear.ts";
import echoCommand from "../commands/builtIn/echo.ts";
import pwdCommand from "../commands/builtIn/pwd.ts";
import cdCommand from "../commands/builtIn/cd.ts";
import typeCommand from "../commands/builtIn/type.ts";
import historyCommand from "../commands/builtIn/history.ts";
import runExternalCommand from "../commands/external/external.ts";

const executeCommand = (
  rl: Interface,
  command: string,
  args: string[],
  stdoutFile: string | null,
  stdoutMode: "w" | "a",
  stderrFile: string | null,
  stderrMode: "w" | "a",
) => {
  //ensure stderr file is writable/appedable always for builtins
  if (stderrFile) {
    fs.closeSync(fs.openSync(stderrFile, stderrMode));
  }

  const ctx = {
    rl,
    command,
    args,
    stdoutFile,
    stdoutMode,
    stderrFile,
    stderrMode,
  };

  /*<-----builtins----->*/
  if (command === "exit") {
    exitCommand(ctx);
    return;
  }

  if (command === "clear") {
    clearCommand(ctx);
    return;
  }

  if (command === "echo") {
    echoCommand(ctx);
    return;
  }

  if (command === "pwd") {
    pwdCommand(ctx);
    return;
  }

  if (command === "cd") {
    cdCommand(ctx);
    return;
  }

  if (command === "type") {
    typeCommand(ctx);
    return;
  }

  if (command === "history") {
    historyCommand(ctx);
    return;
  }

  /*<-----external commands----->*/
  runExternalCommand(ctx);
  return;
};

export default executeCommand;
