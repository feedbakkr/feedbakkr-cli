import { resolve } from "node:path";
import { Command } from "commander";
import { fetchSchema } from "../lib/schema-fetch.js";
import { writeOutput } from "../lib/output.js";

export const pullSchemaCommand = new Command("pull-schema")
	.description("Pull the published schema for a channel and save it locally")
	.argument("<channel-id>", "The channel ID to pull the schema for")
	.option("-o, --out <path>", "Output file path", "./feedbakkr/schema.json")
	.option("-k, --api-key <key>", "Feedbakkr secret API key (or set FEEDBAKKR_API_KEY)")
	.option("--base-url <url>", "API base URL")
	.action(async (channelId: string, opts: { out: string; apiKey?: string; baseUrl?: string }) => {
		const apiKey = opts.apiKey || process.env["FEEDBAKKR_API_KEY"];
		if (!apiKey) {
			console.error(
				"Error: API key is required. Pass --api-key or set FEEDBAKKR_API_KEY environment variable.",
			);
			process.exit(1);
		}

		const outPath = resolve(opts.out);

		try {
			console.log(`Pulling schema for channel ${channelId}...`);
			const result = await fetchSchema({
				channelId,
				apiKey,
				baseUrl: opts.baseUrl,
			});

			writeOutput(outPath, JSON.stringify(result.schema, null, 2) + "\n");
			console.log(`Schema v${result.version} saved to ${outPath}`);
		} catch (err) {
			console.error(
				"Error:",
				err instanceof Error ? err.message : "Failed to pull schema",
			);
			process.exit(1);
		}
	});
