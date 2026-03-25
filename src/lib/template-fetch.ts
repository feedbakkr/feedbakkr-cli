import type { FeedbakkrTemplate } from "./schema-types.js";

const DEFAULT_BASE_URL = "https://api.feedbakkr.com";

export interface FetchTemplateOptions {
	templateKey: string;
	baseUrl?: string;
}

export interface TemplateApiResponse {
	id: string;
	templateId: string;
	templateKey: string;
	title: string;
	description: string | null;
	tags: string[];
	schema: { v: 1; fields: unknown[]; preview?: unknown };
	previewConfig: unknown;
	installCount: number;
	formatVersion: string;
}

/**
 * Fetch a published template from the Feedbakkr public API.
 * No API key required — templates are publicly accessible.
 */
export async function fetchTemplate(opts: FetchTemplateOptions): Promise<FeedbakkrTemplate> {
	const baseUrl = (opts.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
	const url = `${baseUrl}/templates/${opts.templateKey}`;

	const response = await fetch(url);

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

	const data = (await response.json()) as TemplateApiResponse;

	return {
		format_version: data.formatVersion,
		template_id: data.templateId,
		template_key: data.templateKey,
		title: data.title,
		description: data.description ?? undefined,
		schema: data.schema as FeedbakkrTemplate["schema"],
		preview_config: data.previewConfig ?? undefined,
	};
}
