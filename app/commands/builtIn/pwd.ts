//types
import type { CommandContext } from "../types.ts";

//utilities
import { writeOutputToFile } from "../../utils/redirector.ts";

function pwdCommand(ctx: CommandContext) {
  writeOutputToFile(ctx.stdoutFile, ctx.stdoutMode, process.cwd());
  ctx.rl.prompt();
}

export default pwdCommand;
