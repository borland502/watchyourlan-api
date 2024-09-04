import HostRepo from "@src/repos/HostRepo.mjs";
import { Host } from "@src/models/Host.mjs";

function handleSuccess(res: Host[]) {
	// transform to json-api format
	return res;
}

function handleFailure(reason: Error) {
	console.error(reason);
	return reason;
}

/**
 * Get all users.
 */
async function getAll(): Promise<Host[] | Error> {

	return await HostRepo.getAll().then(
		(res) => handleSuccess(res),
		(reason) => handleFailure(reason),
	);
}

// **** Export default **** //

export default {
	getAll,
} as const;
