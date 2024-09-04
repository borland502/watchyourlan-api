// jest.config.ts
import { createDefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

const defaultEsmPreset = createDefaultEsmPreset();

const jestConfig: JestConfigWithTsJest = {
	// [...]
	roots: ["./tests"],
	coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
	...defaultEsmPreset,
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
};

export default jestConfig;
