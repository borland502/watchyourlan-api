import HostRepo from '@src/repos/HostRepo.mjs';
import {Host} from '@src/models/Host.mjs';

function handleSuccess(res: Host[]) {
    console.info(`Retrieved ${res.length} hosts`)
    return res;
}

// function handleFailure(err: Error) {
//     console.error(err)
//     // if (err.name === "SequelizeDatabaseError") {
//     //     HostRepo.createTable().then(res => console.log(res))
//     //     return HostRepo.getAll().then(handleSuccess, reason => {
//     //         // To avoid recursion we don't try again
//     //         console.error(reason)
//     //         return err
//     //     })
//     // }
//     return err
// }
//
// function handleRecovery(err: Error) {
//     return err
// }

function handleFailure(reason: Error) {
    console.error(reason)
    return reason
}

/**
 * Get all users.
 */
async function getAll(): Promise<Host[] | Error> {
    return await HostRepo.getAll().then(res => handleSuccess(res as Host[]), reason => handleFailure(reason))
}

// **** Export default **** //

export default {
    getAll,
} as const;
