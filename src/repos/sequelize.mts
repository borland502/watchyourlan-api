import { Sequelize } from "sequelize-typescript";

import { Host } from "@src/models/Host.mjs";
import { homedir } from "os"

export const sequelize = new Sequelize({
	dialect: "sqlite",
  storage: `${homedir()}/.cache/watchyourlan/db.sqlite`,
	models: [Host],
});
