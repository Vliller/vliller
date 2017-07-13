import { Action } from '@ngrx/store';

import { VlilleStation } from '../models/vlille-station';

/**
 *
 */
export namespace FavoritesActions {
    export const LOAD = "[Favorites] Load";
    export const LOAD_SUCCESS = "[Favorites] Load Success";
    export const LOAD_FAIL = "[Favorites] Load Fail";

    export const ADD = "[Favorites] Add Station";
    export const ADD_SUCCESS = "[Favorites] Add Station Success";
    export const ADD_FAIL = "[Favorites] Add Station Fail";
    export const ADD_FAIL_MAX_SIZE = "[Favorites] Add Station Fail : max size already reached";

    export const REMOVE = "[Favorites] Remove Station";
    export const REMOVE_SUCCESS = "[Favorites] Remove Station Success";
    export const REMOVE_FAIL = "[Favorites] Remove Station Fail";

    /**
     * Load favorites actions
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
     * Add favorites actions
     */
    export class Add implements Action {
        readonly type = ADD;

        constructor(public payload: VlilleStation) {}
    }

    export class AddSuccess implements Action {
        readonly type = ADD_SUCCESS;

        constructor(public payload: VlilleStation) {}
    }

    export class AddFail implements Action {
        readonly type = ADD_FAIL;

        constructor(public payload: any) {}
    }

    export class AddFailMaxSize implements Action {
        readonly type = ADD_FAIL_MAX_SIZE;
    }

    /**
     * Remove favorites actions
     */
    export class Remove implements Action {
        readonly type = REMOVE;

        constructor(public payload: VlilleStation) {}
    }

    export class RemoveSuccess implements Action {
        readonly type = REMOVE_SUCCESS;

        constructor(public payload: VlilleStation) {}
    }

    export class RemoveFail implements Action {
        readonly type = REMOVE_FAIL;

        constructor(public payload: any) {}
    }


    /**
     * All favorites actions
     */
    export type All
        = Load
        | LoadSuccess
        | LoadFail
        | Add
        | AddSuccess
        | AddFail
        | AddFailMaxSize
        | Remove
        | RemoveSuccess
        | RemoveFail;
}