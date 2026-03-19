import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Write content to a file, creating parent directories if needed.
 */
export function writeOutput(filePath: string, content: string): void {
	mkdirSync(dirname(filePath), { recursive: true });
	writeFileSync(filePath, content, "utf-8");
}
