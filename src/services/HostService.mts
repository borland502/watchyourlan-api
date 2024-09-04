import HostRepo from "@src/repos/HostRepo.mjs";
import { Host } from "@src/models/Host.mjs";

export interface Hosts {
	rows: Host[];
	count: number;
}

function handleSuccess(res: Hosts) {
	return res;
}

function handleFailure(reason: Error) {
	console.error(reason);
	return reason;
}

/**
 * Get all users.
 */
async function getAll(limit: number, range: number[]): Promise<Hosts | Error> {

	if (limit > 0 || range[0] > 0) {
		return await HostRepo.findAndCountAll(limit, range).then(
			(res) => handleSuccess(res),
			(reason) => handleFailure(reason),
		);
	}
	return await HostRepo.findAndCountAll(500, range).then(
		(res) => handleSuccess(res),
		(reason) => handleFailure(reason),
	);
}

// **** Export default **** //

export default {
	getAll,
} as const;
