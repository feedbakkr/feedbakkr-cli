import type { PullSchemaResponse } from "./schema-types.js";

const DEFAULT_BASE_URL = "https://api.feedbakkr.com";

export interface FetchSchemaOptions {
	channelId: string;
	apiKey: string;
	baseUrl?: string;
}

/**
 * Fetch the published schema for a channel from the Feedbakkr API.
 * Uses a secret API key for authentication.
 */
export async function fetchSchema(opts: FetchSchemaOptions): Promise<PullSchemaResponse> {
	const baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
	const url = `${baseUrl}/v1/channels/${opts.channelId}/schema`;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${opts.apiKey}`,
		},
	});

	if (!response.ok) {
		let errorMessage = `API returned ${response.status}`;
		try {
			const body = (await response.json()) as { message?: string; code?: string };
			if (body.message) {
				errorMessage = `${body.code ?? response.status}: ${body.message}`;
			}
		} catch {
			// ignore parse failure
		}
		throw new Error(errorMessage);
	}

	return (await response.json()) as PullSchemaResponse;
}
