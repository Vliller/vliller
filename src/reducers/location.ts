import { AppSettings } from '../app/app.settings';
import { LocationActions } from '../actions/location';
import { MapPosition } from '../components/map/map-position';

/**
 *
 */
export interface LocationState {
    position: MapPosition,
    isLoading: boolean
}

const initialState: LocationState = {
    position: AppSettings.defaultPosition,
    isLoading: false
};

/**
 * Reducers
 *
 * @param  {LocationState = initialState} state
 * @param  {LocationActions.All}          action
 * @return {LocationState}
 */
export function locationReducer(state: LocationState = initialState, action: LocationActions.All): LocationState {
    switch (action.type) {
        case LocationActions.UPDATE: {
            return {
                ...state,

                // start loading
                isLoading: true
            }
        }

        case LocationActions.UPDATE_SUCCESS: {
            return {
                ...state,

                // updates current position
                position: action.payload,
                isLoading: false
            }
        }

        case LocationActions.UPDATE_FAIL: {
            return {
                ...state,

                // stop loading
                isLoading: false
            }
        }

        default:
            return state;
    }
}