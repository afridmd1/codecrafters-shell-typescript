//types
import type { CommandContext } from "../types.ts";

//utilities
import { writeOutputToFile } from "../../utils/redirector.ts";

function echoCommand(ctx: CommandContext) {
  writeOutputToFile(ctx.stdoutFile, ctx.stdoutMode, ctx.args.join(" "));
  ctx.rl.prompt();
}

export default echoCommand;
