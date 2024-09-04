import HttpStatusCodes from "@src/common/HttpStatusCodes.mjs";
import HostService from "@src/services/HostService.mjs";
import { IReq, IRes } from "@src/routes/common/types.mjs";
import get from "lodash/get";
import { Host } from "@src/models/Host.mjs";
import * as jsonapi from "jsonapi-serializer";

// **** Functions **** //

/**
 * transform to json-api format
 * @param res
 * @param hosts
 */
function toJsonApi(res: IRes, hosts: Host[]) {
	res.appendHeader("Content-Type", "application/vnd.api+json")
	const hostSerializer = new jsonapi.Serializer("hosts", {
		attributes: ["ID", "NAME", "IP", "MAC", "HW", "DATE", "KNOWN", "NOW"]
	})
	return res.status(HttpStatusCodes.OK).json(hostSerializer.serialize(hosts))
}

/**
 * Get all users.
 */
function getAll(_: IReq, res: IRes) {
	HostService.getAll()
		.then((hosts: Host[] | Error) => {
			if (hosts !== undefined  && get(hosts, "length", 0) <= 0) {
				console.log("No hosts found")
				return res.status(HttpStatusCodes.NO_CONTENT).json({});
			} else if (hosts instanceof Error) {
				return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({});
			}

			return toJsonApi(res, hosts);
	}).catch((reason) => {
			console.error(`Could not recover from error: ${reason}`);
			return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({});
	})
}

export default {
	getAll,
} as const;
