import { Action } from '@ngrx/store';

import { VlilleStation } from '../models/vlille-station';

/**
 *
 */
export namespace StationsActions {
    export const LOAD = "[Stations] Load";
    export const LOAD_SUCCESS = "[Stations] Load Success";
    export const LOAD_FAIL = "[Stations] Load Fail";

    export const UPDATE_ACTIVE = "[Stations] Update Active Station";
    export const UPDATE_ACTIVE_SUCCESS = "[Stations] Update Active Station Success";
    export const UPDATE_ACTIVE_FAIL = "[Stations] Update Active Station Fail";


    /**
     * Load stations actions
     */
    export class Load implements Action {
        readonly type = LOAD;
    }

    export class LoadSuccess implements Action {
        readonly type = LOAD_SUCCESS;

        constructor(public payload: VlilleStation[]) {}
    }

    export class LoadFail implements Action {
        readonly type = LOAD_FAIL;

        constructor(public payload: any) {}
    }

    /**
     * Update active station actions
     */
    export class UpdateActive implements Action {
        readonly type = UPDATE_ACTIVE;

        constructor(public payload: VlilleStation) {}
    }

    export class UpdateActiveSuccess implements Action {
        readonly type = UPDATE_ACTIVE_SUCCESS;

        constructor(public payload: VlilleStation) {}
    }

    export class UpdateActiveFail implements Action {
        readonly type = UPDATE_ACTIVE_FAIL;

        constructor(public payload: any) {}
    }

    /**
     * All stations actions
     */
    export type All
        = Load
        | LoadSuccess
        | LoadFail
        | UpdateActive
        | UpdateActiveSuccess
        | UpdateActiveFail;
}