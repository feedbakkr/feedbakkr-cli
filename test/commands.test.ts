import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync, existsSync, rmSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { writeOutput } from "../src/lib/output.js";
import { fetchSchema } from "../src/lib/schema-fetch.js";

describe("writeOutput", () => {
	const tmpDir = resolve("test/.tmp-output");

	beforeEach(() => {
		mkdirSync(tmpDir, { recursive: true });
	});

	afterEach(() => {
		rmSync(tmpDir, { recursive: true, force: true });
	});

	it("creates file and parent directories", () => {
		const filePath = join(tmpDir, "sub/dir/test.ts");
		writeOutput(filePath, "export type X = string;\n");

		expect(existsSync(filePath)).toBe(true);
		expect(readFileSync(filePath, "utf-8")).toBe("export type X = string;\n");
	});

	it("overwrites existing file", () => {
		const filePath = join(tmpDir, "overwrite.ts");
		writeOutput(filePath, "first");
		writeOutput(filePath, "second");
		expect(readFileSync(filePath, "utf-8")).toBe("second");
	});
});

describe("fetchSchema", () => {
	it("sends correct request", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					version: 3,
					schema: { v: 1, fields: [{ k: "name", t: "text", label: "Name" }] },
				}),
		});

		vi.stubGlobal("fetch", mockFetch);

		const result = await fetchSchema({
			channelId: "ch-123",
			apiKey: "fbk_sk_live_test",
			baseUrl: "https://api.test.com",
		});

		expect(mockFetch).toHaveBeenCalledWith("https://api.test.com/v1/channels/ch-123/schema", {
			headers: { Authorization: "Bearer fbk_sk_live_test" },
		});
		expect(result.version).toBe(3);
		expect(result.schema.fields).toHaveLength(1);

		vi.unstubAllGlobals();
	});

	it("throws on non-ok response", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404,
			json: () => Promise.resolve({ code: "NOT_FOUND", message: "Channel not found" }),
		});

		vi.stubGlobal("fetch", mockFetch);

		await expect(
			fetchSchema({ channelId: "bad", apiKey: "key", baseUrl: "https://api.test.com" }),
		).rejects.toThrow("NOT_FOUND: Channel not found");

		vi.unstubAllGlobals();
	});

	it("handles non-JSON error response", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			json: () => Promise.reject(new Error("not json")),
		});

		vi.stubGlobal("fetch", mockFetch);

		await expect(
			fetchSchema({ channelId: "x", apiKey: "key", baseUrl: "https://api.test.com" }),
		).rejects.toThrow("API returned 500");

		vi.unstubAllGlobals();
	});
});
