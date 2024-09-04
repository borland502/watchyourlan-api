// https://github.com/ranmocy/gmail-automata/blob/37b828f35e79296e6b62c87fc77fe69a74a3e30e/Config.ts#L46
/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { xdgConfig } from "xdg-basedir";
import fs, { PathLike } from "fs";
import { close } from "fs-extra";
import { Dialect } from "sequelize";

jest.mock("fs");
jest.mock("fs-extra");
jest.mock("xdg-basedir", () => ({
	xdgConfig: "/tmp/config",
}));

/**
 * Load config file from ${XDG_CONFIG_HOME}/.config/watchyourlan-api/config.toml
 */
function loadToml(): string | undefined {
	let res: string | undefined = undefined;

	try {
		const configPath: string = xdgConfig + "/watchyourlan/config.toml";

		fs.open(configPath, "r", (err, fd) => {
			if (err) {
				if (err.code === "ENOENT") {
					console.warn(`Config file not found.  Creating template at ${configPath}`);
					close(fd, (err) => {
						if (err) throw err;
					});

					res = saveToml(configPath);
				}
			}

			try {
				res = fs.readFileSync(fd, "utf-8");
			} finally {
				close(fd, (err) => {
					if (err) throw err;
				});
			}
		});
	} catch (err) {
		console.error(err);
		throw err;
	}

	return res;
}

function saveToml(configPath: string) {
	const configToml = stringify(`
        [database]
        db_file_name = /data/db.sqlite
        dialect = sqlite
        models = [Host]
        table_name = now
        
        [server]
        port = 3000
        `);

	// TODO: Integrate config file
	// TODO: Hash config file for updates with diff for non-destructive

	fs.open(configPath, "w", (err, fd) => {
		fs.writeFileSync(fd, configToml, "utf-8");

		close(fd, (err) => {
			if (err) throw err;
		});
	});

	return configToml;
}

export class Config {
	static instance: Config;
	readonly path: PathLike = "/data/db.sqlite";

	static getInstance(path: PathLike): Config {
		if (!Config.instance) {
			Config.instance = new Config(path);
		}
		return Config.instance;
	}

	constructor(path?: PathLike) {
		if (path !== undefined) {
			this.path = path;
		}
	}

	public static async getConfig() {
		const res = loadToml();

		if (res) {
			const configValues = parse(res);
			const configToml = stringify(configValues);
			console.warn(configToml);
		} else {
			console.error("Could not load config file");
		}
	}
}

describe("Config", () => {
	beforeEach(() => {
		// Clear any saved instances before each test
		Config.instance = undefined;
	});

	it("should create a new instance of Config if one does not exist", () => {
		const config = Config.getInstance("/tmp/test.sqlite");
		expect(config).toBeInstanceOf(Config);
		expect(config.path).toBe("/tmp/test.sqlite");
	});

	it("should return the existing instance of Config if one exists", () => {
		const config1 = Config.getInstance("/tmp/test.sqlite");
		const config2 = Config.getInstance("/tmp/test.sqlite");
		expect(config1).toBe(config2);
	});

	it("should load config values from the config file", async () => {
		const configToml = `
        [database]
        db_file_name = /data/db.sqlite
        dialect = sqlite
        models = [Host]
        table_name = now

        [server]
        port = 3000
        `;
		(fs.open as jest.Mock).mockImplementation((path, mode, callback) => {
			callback(null, "mocked-fd");
		});
		(fs.readFileSync as jest.Mock).mockReturnValue(configToml);

		await Config.getConfig();

		expect(fs.open).toHaveBeenCalledWith("/tmp/config/watchyourlan/config.toml", "r", expect.any(Function));
		expect(fs.readFileSync).toHaveBeenCalledWith("mocked-fd", "utf-8");
		// Add more expectations here to verify that the config values are loaded correctly
	});

	it("should create a new config file if one does not exist", async () => {
		const configPath = "/tmp/config/watchyourlan/config.toml";
		const configToml = `
        [database]
        db_file_name = /data/db.sqlite
        dialect = sqlite
        models = [Host]
        table_name = now

        [server]
        port = 3000
        `;
		(fs.open as jest.Mock)
			.mockImplementationOnce((path, mode, callback) => {
				callback({ code: "ENOENT" }, null);
			})
			.mockImplementationOnce((path, mode, callback) => {
				callback(null, "mocked-fd");
			});
		(fs.writeFileSync as jest.Mock).mockImplementation((fd, data, encoding) => {
			// Assert that the file is written with the correct data
			expect(data).toEqual(configToml);
		});

		await Config.getConfig();

		expect(fs.open).toHaveBeenCalledWith(configPath, "r", expect.any(Function));
		expect(fs.open).toHaveBeenCalledWith(configPath, "w", expect.any(Function));
		expect(fs.writeFileSync).toHaveBeenCalledWith("mocked-fd", configToml, "utf-8");
	});
});
