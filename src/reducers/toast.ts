import { Store, ActionReducer } from '@ngrx/store';

import { Toast } from '../models/toast';
import { ToastActions } from '../actions/toast';

/**
 *
 */
export interface ToastState {
    toast: Toast
}

const initialState: ToastState = {
    toast: undefined
};

/**
 * Reducers
 *
 * @param  {ToastState = initialState} state
 * @param  {ToastActions.All}          action
 * @return {ToastState}
 */
export function toastReducer(state: ToastState = initialState, action: ToastActions.All): ToastState {
    switch (action.type) {
        case ToastActions.SHOW_TOAST:
            return {
                toast: new Toast(action.payload.message, action.payload.options)
            };

        case ToastActions.SHOW_ERROR_TOAST:
            let options = Object.assign({}, action.payload.options, {
                isError: true
            });

            return {
                toast: new Toast(action.payload.message, options)
            };

        case ToastActions.HIDE_TOAST:
            // toast is hidden in his initial state
            return initialState;

        default:
            return state;
    }
}