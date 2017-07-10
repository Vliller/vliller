import { Action } from '@ngrx/store';

import { MapPosition } from '../components/map/map-position';

/**
 *
 */
export namespace LocationActions {
    export const REQUEST = "[Location] Request"
    export const REQUEST_SUCCESS = "[Location] Request Success"
    export const REQUEST_FAIL = "[Location] Request Fail"

    export const UPDATE = "[Location] Update";
    export const UPDATE_SUCCESS = "[Location] Update Success";
    export const UPDATE_FAIL = "[Location] Update Fail";

    /**
     * Update current position
     */
    export class Request implements Action {
        readonly type = REQUEST;
    }

    export class RequestSuccess implements Action {
        readonly type = REQUEST_SUCCESS;
    }

    export class RequestFail implements Action {
        readonly type = REQUEST_FAIL;

        constructor(public payload: any) {}
    }

    /**
     * Update current position
     */
    export class Update implements Action {
        readonly type = UPDATE;
    }

    export class UpdateSuccess implements Action {
        readonly type = UPDATE_SUCCESS;

        constructor(public payload: MapPosition) {}
    }

    export class UpdateFail implements Action {
        readonly type = UPDATE_FAIL;

        constructor(public payload: any) {}
    }

    /**
     * All stations actions
     */
    export type All
        = Request
        | RequestSuccess
        | RequestFail
        | Update
        | UpdateSuccess
        | UpdateFail;
}