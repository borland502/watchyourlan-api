import { $, chalk, LogEntry, ProcessOutput, ProcessPromise, which } from "zx";
// @ts-expect-error ZX scripts do not include the chalk module in the same way, but the library is the same
import { ChalkInstance } from "chalk";

const MonokaiFilterSpectrumColors: Record<string, ChalkInstance> = {
	red: chalk.hex("#fc618d"),
	orange: chalk.hex("#fd9353"),
	yellow: chalk.hex("#fcd566"),
	green: chalk.hex("#7bd88f"),
	blue: chalk.hex("#5ad4e6"),
	purple: chalk.hex("#948ae3"),
	base0: chalk.hex("#131313"),
	base1: chalk.hex("#191919"),
	base2: chalk.hex("#222222"),
	base3: chalk.hex("#363537"),
	base4: chalk.hex("#525053"),
	base5: chalk.hex("#69676c"),
	base6: chalk.hex("#8b888f"),
	base7: chalk.hex("#bab6c0"),
	base8: chalk.hex("#f7f1ff"),
	base8x0c: chalk.hex("#2b2b2b"),
};

/**
 * States to use with the exported log constant to color it
 */
export const LogLevel: Record<string, ChalkInstance> = {
	debug: MonokaiFilterSpectrumColors.blue,
	info: MonokaiFilterSpectrumColors.purple,
	warn: MonokaiFilterSpectrumColors.orange,
	error: MonokaiFilterSpectrumColors.red,
};

export const log = (msg: string, level: ChalkInstance) => console.log(level(msg));

/**
 * Zx script to add color based on output type
 * @param entry one of the following:
 *
 * stdout
 * stderr
 * cmd
 * fetch
 * cd
 * custom
 * retry
 */
export function logProcessor(entry: LogEntry) {
	switch (entry.kind) {
		case "stdout":
			log(entry.data.toString(), MonokaiFilterSpectrumColors.purple);
			break;
		case "stderr":
			log(entry.data.toString(), MonokaiFilterSpectrumColors.red);
			break;
		case "cmd":
			log(`Running command: ${entry.cmd}`, MonokaiFilterSpectrumColors.blue);
			break;
		case "fetch":
			log(`Fetching ${entry.url} through ${entry.init?.method}`, MonokaiFilterSpectrumColors.green);
			break;
		case "cd":
			log(`Changing directory to ${entry.dir}`, MonokaiFilterSpectrumColors.yellow);
			break;
		case "custom":
			log(`executing custom zx function: ${entry.data.toString()}`, MonokaiFilterSpectrumColors.orange);
			break;
		case "retry":
			log(`retrying due to ${entry.error}`, MonokaiFilterSpectrumColors.base8);
	}
}

const whichOptions = {
	path: "/bin:/usr/bin:/usr/local/bin",
	nothrow: true,
};

export async function detectedShell(): Promise<string | boolean> {
	const shells: (string | null)[] = [
		await which("zsh", whichOptions),
		await which("bash", whichOptions),
		await which("sh", whichOptions),
	];

	// set the shell in order of preference [zsh -> bash -> sh]
	for (const shell of shells) {
		if (shell) {
			return shell;
		}
	}

	return false;
}

// configure zx
$.shell = await detectedShell();
$.log = logProcessor;

export async function build_cmd(): Promise<ProcessOutput> {
	const command: ProcessPromise = $`npx webpack --config ./webpack.config.js --entry ./src/index.mts --mode production`;
	command.nothrow();
	command.verbose(false);
	return command;
}

export async function lint_cmd(): Promise<ProcessOutput> {
	const command: ProcessPromise = $`npx eslint@latest --ignore-pattern '**/build/**' --ignore-pattern '**/dist/**' \
	 --ignore-pattern '**/scripts/**' --ignore-pattern '**/coverage/**' --ignore-pattern '**/docker/**' **/*.mts .
	 `;
	command.nothrow();
	command.verbose(false);
	return command;
}
