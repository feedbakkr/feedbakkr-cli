import { Command } from "commander";
import { codegenCommand } from "./commands/codegen.js";
import { pullSchemaCommand } from "./commands/pull-schema.js";

const program = new Command()
	.name("feedbakkr")
	.description("Feedbakkr CLI — schema tools and type generation")
	.version("0.1.0");

program.addCommand(pullSchemaCommand);
program.addCommand(codegenCommand);

program.parse();
