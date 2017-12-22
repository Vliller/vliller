import { Action } from '@ngrx/store';
import { ToastOptionsInterface } from '../models/toast';

/**
 *
 */
export namespace ToastActions {
    export const SHOW_TOAST = "[Toast] Show";
    export const SHOW_ERROR_TOAST = "[Toast] Show Error";
    export const HIDE_TOAST = "[Toast] Hide";

    export interface ToastPayload {
        message: string,
        options?: ToastOptionsInterface
    }

    export class Show implements Action {
        readonly type = SHOW_TOAST;

        constructor(public payload: ToastPayload) {}
    }

    export class ShowError implements Action {
        readonly type = SHOW_ERROR_TOAST;

        constructor(public payload: ToastPayload) {}
    }

    export class Hide implements Action {
        readonly type = HIDE_TOAST;
    }

    export type All = Show | ShowError | Hide;
}