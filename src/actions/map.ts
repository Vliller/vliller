import { Action } from '@ngrx/store';

/**
 *
 */
export namespace MapActions {
    export const SET_CLICKABLE = "[Map] Set clickable";

    export class SetClickable implements Action {
        readonly type = SET_CLICKABLE;

        constructor(public payload: boolean) {}
    }

    export type All = SetClickable;
}