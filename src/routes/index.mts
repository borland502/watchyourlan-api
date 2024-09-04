import { Router } from "express";
import HostRoutes from "@src/routes/HostRoutes.mjs";

import Paths from "../common/Paths.mjs";

// **** Variables **** //

const apiRouter = Router();

// ** Add UserRouter ** //

// Init router
const hostRouter = Router();

// Get all hosts
hostRouter.get(Paths.Hosts.Get, HostRoutes.getAll);

// Add HostRouter
apiRouter.use(Paths.Hosts.Base, hostRouter);

// **** Export default **** //

export default apiRouter;
