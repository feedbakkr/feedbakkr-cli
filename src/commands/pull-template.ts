import { resolve } from "node:path";
import { Command } from "commander";
import { fetchTemplate } from "../lib/template-fetch.js";
import { writeOutput } from "../lib/output.js";

export const pullTemplateCommand = new Command("pull-template")
	.description("Pull a template from the Feedbakkr marketplace and save it locally")
	.argument("<template-key>", "Template key (e.g. 'contact-form')")
	.option("-o, --out <path>", "Output file path")
	.option("--base-url <url>", "API base URL")
	.action(async (templateKey: string, opts: { out?: string; baseUrl?: string }) => {
		const defaultOut = `./${templateKey}.template.json`;
		const outPath = resolve(opts.out ?? defaultOut);

		try {
			console.log(`Pulling template "${templateKey}"...`);
			const template = await fetchTemplate({
				templateKey,
				baseUrl: opts.baseUrl,
			});

			writeOutput(outPath, JSON.stringify(template, null, 2) + "\n");
			console.log(`Template "${template.title}" saved to ${outPath}`);
		} catch (err) {
			console.error(
				"Error:",
				err instanceof Error ? err.message : "Failed to pull template",
			);
			process.exit(1);
		}
	});
