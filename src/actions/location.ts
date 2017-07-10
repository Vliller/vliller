import { Action } from '@ngrx/store';

import { MapPosition } from '../components/map/map-position';

/**
 *
 */
export namespace LocationActions {
    export const UPDATE = "[Position] Update";
    export const UPDATE_SUCCESS = "[Stations] Update Success";
    export const UPDATE_FAIL = "[Stations] Update Fail";

    /**
     * Update current position
     */
    export class Update implements Action {
        readonly type = UPDATE;

        constructor() {}
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
        = Update
        | UpdateSuccess
        | UpdateFail;
}