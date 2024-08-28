import HttpStatusCodes from '@src/common/HttpStatusCodes.mjs';
import HostService from '@src/services/HostService.mjs';
import {IReq, IRes} from "@src/routes/common/types.mjs";

// **** Functions **** //

/**
 * Get all users.
 */
function getAll(_: IReq, res: IRes) {
   HostService.getAll().then(hosts => {
    return res.status(HttpStatusCodes.OK).json({hosts});
   }).catch((reason) => {
       console.error(`Could not recover from error: ${reason}`)
       return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({})
   })

}

export default {
  getAll
} as const;