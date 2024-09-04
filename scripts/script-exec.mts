#!/usr/bin/env -S npx tsx

import "zx/globals";
import { argv, ProcessOutput } from "zx";
import * as scripts from "@scripts/script-lib.mjs"
import toNumber from "lodash/toNumber";

// configure zx
$.shell = await scripts.detectedShell()
$.log = scripts.logProcessor

async function processCommand() {
	// process command to execute
	switch (argv.cmd) {
		case "build":
			return await scripts.build_cmd()
		case "lint":
			return await scripts.lint_cmd()
	}
	return null;
}

const processEnd: ProcessOutput | null = await processCommand()

// gentle exit does not seem to be as certain
process.kill(toNumber(processEnd?.signal) || process.exit(1))

