import { Store, ActionReducer } from '@ngrx/store';

import { LocationActions } from '../actions/location';
import { MapPosition } from '../components/map/map-position';

/**
 *
 */
export interface LocationState {
    position: MapPosition
}

const initialState: LocationState = {
    position: undefined
};

/**
 * Reducers
 *
 * @param  {LocationState = initialState} state
 * @param  {LocationActions.All}          action
 * @return {LocationState}
 */
export function locationReducer(state: LocationState = initialState, action: LocationActions.All): LocationState {
    console.log(action)
    switch (action.type) {
        case LocationActions.UPDATE_SUCCESS: {
            return {
                ...state,

                // updates current position
                position: action.payload
            }
        }

        default:
            return state;
    }
}