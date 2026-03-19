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
