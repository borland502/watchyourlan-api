import HttpStatusCodes from "@src/common/HttpStatusCodes.mjs";
import HostService from "@src/services/HostService.mjs";
import { IReq, IRes } from "@src/routes/common/types.mjs";
import get from "lodash/get";
import { config } from "node-config-ts";
import toInteger from "lodash/toInteger";
import { Hosts } from "@src/services/HostService.mjs";

// **** Functions **** //

/**
 * Get all users.
 */
function getAll(req: IReq, res: IRes) {
	// TODO: Defaults: filter, range, sort, page, limit
	// const filter = get(req.query, "filter", {});
	const range: number[] = JSON.parse(get(req.query, "range", "[1,20]") as string).map(toInteger);

	// const sort = get(req.query, "sort", {});
	// const page = get(req.query, "page", 1);
	const limit = get(req.query, "limit", config.server.defaultResultsPerPage);

	HostService.getAll(limit, range)
		.then((hostsRaw: Hosts | Error) => {
			if (hostsRaw !== undefined && get(hostsRaw, "rows.length", 0) <= 0) {
				return res.status(HttpStatusCodes.NO_CONTENT).json({});
			} else if (hostsRaw instanceof Error) {
				return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({});
			}

			const hosts = hostsRaw.rows;

			return res
				.status(HttpStatusCodes.OK)
				.appendHeader("Content-Range", `hosts ${range[0]}-${range[1] - 1}/${get(hostsRaw, "count")}`)
				.json({ hosts });
		})
		.catch((reason) => {
			console.error(`Could not recover from error: ${reason}`);
			return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({});
		});
}

export default {
	getAll,
} as const;
