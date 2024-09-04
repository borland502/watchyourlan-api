import { Sequelize } from "sequelize-typescript";

import { Host } from "@src/models/Host.mjs";

export const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "/data/db.sqlite",
	models: [Host],
});
