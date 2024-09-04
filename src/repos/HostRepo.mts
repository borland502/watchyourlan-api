import { Host } from "@src/models/Host.mjs";
import { DataTypes, QueryTypes } from "sequelize";
import { sequelize } from "@src/repos/sequelize.mjs";

/**
 * Adapt the watchyourlan table layout to the format expected by the React Admin front end.
 */
Host.init(
	{
		id: {
			type: new DataTypes.INTEGER(),
			primaryKey: true,
			autoIncrement: true,
			field: "ID",
		},
		name: {
			type: new DataTypes.STRING(),
			allowNull: false,
			field: "NAME",
		},
		ip: {
			type: new DataTypes.STRING(),
			allowNull: true,
			field: "IP",
		},
		mac: {
			type: new DataTypes.STRING(),
			allowNull: true,
			field: "MAC",
		},
		hw: {
			type: new DataTypes.STRING(),
			allowNull: true,
			field: "HW",
		},
		date: {
			type: new DataTypes.STRING(),
			allowNull: true,
			field: "DATE",
		},
		known: {
			type: new DataTypes.INTEGER(),
			allowNull: true,
			field: "KNOWN",
		},
		now: {
			type: new DataTypes.INTEGER(),
			allowNull: true,
			field: "NOW",
		},
	},
	{ sequelize: sequelize, tableName: "now", modelName: "Host", createdAt: false, updatedAt: false, deletedAt: false },
);

/**
 * Retrieves a paginated list of hosts and network metdadata from the database.
 *
 * @param limit - The maximum number of hosts to retrieve.
 * @param range - The number of hosts to skip (for pagination).
 * @returns A Promise that resolves to an object containing the retrieved hosts and the total count.
 */
async function findAndCountAll(limit: number, range: number[]) {
	return await Host.findAndCountAll({
		limit: limit,
		offset: range[0],
	});
}

/**
 * Creates the necessary database tables if they don't exist.
 * This function uses the `sequelize.sync()` method to synchronize the database schema.
 */
async function createTable() {
	await sequelize.sync();
}

/**
 * Retrieves all records from the "now" table in the database.
 *
 * @returns A Promise that resolves to an array of objects, where each object represents a row from the "now" table.
 */
async function getAll() {
	return await sequelize.query("SELECT * FROM `now`", {
		type: QueryTypes.SELECT,
	});
}

export default {
	getAll,
	createTable,
	findAndCountAll,
} as const;
