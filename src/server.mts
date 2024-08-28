/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';

import BaseRouter from '@src/routes/index.mjs';

import Paths from '@src/common/Paths.mjs';
import HttpStatusCodes from '@src/common/HttpStatusCodes.mjs';
import { RouteError } from '@src/common/classes.mjs';

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser("xxxxxxxxxxxxxx"))






// Show routes called in console during development
// if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
//   app.use(morgan('dev'));
// }

// Security
// if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
//   app.use(helmet());
// }

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((
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
});

// **** Export default **** //

export default app;
