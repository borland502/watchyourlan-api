/**
 * Shared types for routes.
 */

import { Response, Request } from "express";

// **** Express **** //

type TObj = Record<string, unknown>;

export type IReq = Request<TObj, void, TObj, TObj>;
export type IRes = Response<unknown, TObj>;


export interface Dto {
	type: string;
	id: number;
	attributes: {
		date: string | undefined;
		known: number | undefined;
		ip: string | undefined;
		now: number | undefined;
		name: string;
		mac: string | undefined;
		hw: string | undefined
	};
}
