import './pre-start.mjs'; // Must be the first import
import app from './server.mjs';
import {sequelize} from "@src/repos/sequelize.mjs";
import {createServer} from 'http';

// **** Run **** //

const SERVER_START_MSG: string = "Express server started on port: 3000";
(async () => {
    await sequelize.sync();
    createServer(app).listen(3000, () => console.info(SERVER_START_MSG));
})();
