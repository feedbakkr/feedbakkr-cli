import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Command } from "commander";
import type { FeedbakkrSchema } from "../lib/schema-types.js";
import { isTemplateWrapper } from "../lib/schema-types.js";
import { deriveTypeName, schemaToTypeScript } from "../lib/schema-to-typescript.js";
import { writeOutput } from "../lib/output.js";

export const codegenCommand = new Command("codegen")
	.description("Generate TypeScript types from a Feedbakkr schema or template JSON file")
	.argument("<schema-file>", "Path to the schema or template JSON file")
	.option("-o, --out <path>", "Output TypeScript file path")
	.option("-n, --name <name>", "Interface name (default: derived from file name)")
	.action((schemaFile: string, opts: { out?: string; name?: string }) => {
		const inputPath = resolve(schemaFile);
		let raw: string;
		try {
			raw = readFileSync(inputPath, "utf-8");
		} catch {
			console.error(`Error: Could not read file: ${inputPath}`);
			process.exit(1);
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(raw);
		} catch {
			console.error("Error: File is not valid JSON");
			process.exit(1);
		}

		let schema: FeedbakkrSchema;
		if (isTemplateWrapper(parsed)) {
			schema = parsed.schema;
			if (schema.v !== 1 || !Array.isArray(schema.fields)) {
				console.error("Error: Template contains an invalid schema (expected v: 1 and fields array)");
				process.exit(1);
			}
		} else {
			schema = parsed as FeedbakkrSchema;
			if (schema.v !== 1 || !Array.isArray(schema.fields)) {
				console.error("Error: File does not appear to be a valid Feedbakkr schema (expected v: 1 and fields array)");
				process.exit(1);
			}
		}

		const typeName = opts.name ?? deriveTypeName(schemaFile);

		const defaultOut = inputPath.replace(/\.(template\.json|schema\.json|json)$/i, ".ts");
		const outPath = resolve(opts.out ?? defaultOut);

		const output = schemaToTypeScript(schema, typeName);
		writeOutput(outPath, output);

		console.log(`Generated ${typeName} in ${outPath}`);
	});
