import { Action } from '@ngrx/store';
import { MapPosition } from '../models/map-position';

/**
 *
 */
export namespace MapActions {
    export const SET_CLICKABLE = "[Map] Set clickable";
    export const SET_CENTER = "[Map] Set center";

    export class SetClickable implements Action {
        readonly type = SET_CLICKABLE;

        constructor(public payload: boolean) {}
    }

    export class SetCenter implements Action {
        readonly type = SET_CENTER;

        constructor(public payload: MapPosition) {}
    }

    export type All
        = SetClickable
        | SetCenter;
}