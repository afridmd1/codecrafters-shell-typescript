//types
import type { CommandContext } from "../types.ts";

function exitCommand(ctx: CommandContext) {
  ctx.rl.close();
}

export default exitCommand;
