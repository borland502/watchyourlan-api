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

import {parse, stringify} from "smol-toml";
import {xdgConfig} from "xdg-basedir";
import fs from "fs"
import {close} from "fs-extra";
import {Dialect} from "sequelize";
import {Host} from "@src/models/Host.mjs";

export interface MutableConfig extends Record<string, Config> {
    db_file_name: string
    dialect: Dialect
    models: Host[]
}

/**
 * Load config file from ${XDG_CONFIG_HOME}/.config/watchyourlan-api/config.toml
 */
function loadToml(): string | undefined {
    let res: string | undefined = undefined;

    try {
        const configPath: string = xdgConfig + "/watchyourlan/config.toml"

        fs.open(configPath, 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.warn(`Config file not found.  Creating template at ${configPath}`)
                    close(fd, (err) => {
                        if (err) throw err
                    });

                    res = saveToml(configPath)
                }
            }

            try {
                res = fs.readFileSync(fd, "utf-8")
            } finally {
                close(fd, (err) => {
                    if (err) throw err;
                });
            }
        });
    } catch (err) {
        console.error(err)
        throw err
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
        `)

    // TODO: Integrate config file
    // TODO: Hash config file for updates with diff for non-destructive

    fs.open(configPath, 'w', (err, fd) => {

        fs.writeFileSync(fd, configToml, "utf-8")

        close(fd, (err) => {
            if (err) throw err
        });
    })

    return configToml
}

export class Config {
    // public readonly db_file_name: string;
    // public readonly dialect: Dialect;
    // public readonly models: Model[];

    public static async getConfig() {
        // let config: MutableConfig = {
        //     db_file_name: "db.sqlite",
        //     dialect: "sqlite",
        //     models: [Host],
        // };
        const res = loadToml()

        if (res) {
            const configValues = parse(res)
            const configToml = stringify(configValues);
            console.warn(configToml)
        } else {
            console.error("Could not load config file")
        }
    }
}

Config.getConfig()