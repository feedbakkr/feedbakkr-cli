/** Matches the Feedbakkr SchemaDslV1 shape. */
export interface SchemaField {
	k: string;
	t: "text" | "textarea" | "date" | "bool" | "number" | "fixed" | "dynlist";
	label: string;
	req?: boolean;
	min?: number;
	max?: number;
	opts?: { k: string; label?: string }[];
	item?: SchemaField;
	maxItems?: number;
}

export interface FeedbakkrSchema {
	v: 1;
	title?: string;
	desc?: string;
	fields: SchemaField[];
	preview?: unknown;
}

export interface PullSchemaResponse {
	version: number;
	schema: FeedbakkrSchema;
}

export interface FeedbakkrTemplate {
	format_version: string;
	template_id: string;
	template_key?: string;
	title?: string;
	description?: string;
	schema: FeedbakkrSchema;
	preview_config?: unknown;
	metadata?: Record<string, unknown>;
}

export function isTemplateWrapper(json: unknown): json is FeedbakkrTemplate {
	return (
		typeof json === "object" &&
		json !== null &&
		"format_version" in json &&
		"schema" in json
	);
}
