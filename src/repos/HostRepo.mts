import {Host} from "@src/models/Host.mjs";
import {DataTypes, QueryTypes} from "sequelize";
import {sequelize} from "@src/repos/sequelize.mjs";

Host.init({
    ID: {
        type: new DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NAME: {
        type: new DataTypes.STRING,
        allowNull: false,
    },
    DNS: {
        type: new DataTypes.STRING,
        allowNull: false,
    },
    IFACE: {
        type: new DataTypes.STRING,
        allowNull: false,
    },
    IP: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    MAC: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    HW: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    DATE: {
        type: new DataTypes.STRING,
        allowNull: true,
    },
    KNOWN: {
        type: new DataTypes.INTEGER,
        allowNull: true,
    },
    NOW: {
        type: new DataTypes.INTEGER,
        allowNull: true,
    }
},{sequelize: sequelize})

async function createTable() {
    await sequelize.sync()
}

async function getAll() {
    return await sequelize.query("SELECT * FROM `now`", {
        type: QueryTypes.SELECT
    });
}

export default {
    getAll, createTable
} as const;