/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
// import helmet from 'helmet';
import express, { Request, Response, NextFunction } from "express";
// import cors from 'cors';

import "express-async-errors";

import BaseRouter from "@src/routes/index.mjs";

import Paths from "@src/common/Paths.mjs";
import HttpStatusCodes from "@src/common/HttpStatusCodes.mjs";
import { RouteError } from "@src/common/classes.mjs";
import paginate from "express-paginate";
import cors from "cors";
import { config } from "node-config-ts";

// **** Variables **** //

const corsOptions = {
	origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174",],
	optionsSuccessStatus: 200,
	methods: "GET",
	allowedHeaders: ["Content-Range"],
	preflightContinue: true,
};

const app = express();
app.use(cors(corsOptions));

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(paginate.middleware(config.server.defaultResultsPerPage, config.server.maxQueryLimit));
app.use(morgan("dev"));
app.use(cookieParser("xxxxxxxxxxxxxx"));

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
	(
		err: Error,
		_: Request,
		res: Response,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		next: NextFunction,
	) => {
		// if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
		//   logger.error(err, true);
		// }
		let status = HttpStatusCodes.BAD_REQUEST;
		if (err instanceof RouteError) {
			status = err.status;
		}
		return res.status(status).json({ error: err.message });
	},
);

// **** Export default **** //

export default app;
