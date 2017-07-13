import { Action } from '@ngrx/store';

/**
 *
 */
export namespace MapActions {
    export const SET_CLICKABLE = "[Map] Set clickable";

    export const SET_EXPANDED = "[Map] Set expanded";

    export class SetClickable implements Action {
        readonly type = SET_CLICKABLE;

        constructor(public payload: boolean) {}
    }

    export class SetExpanded implements Action {
        readonly type = SET_EXPANDED;

        constructor(public payload: boolean) {}
    }

    export type All = SetClickable | SetExpanded;
}