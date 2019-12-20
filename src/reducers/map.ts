import { MapActions } from '../actions/map';
import { MapPosition } from '../models/map-position';

/**
 *
 */
export interface MapState {
    isClickable: boolean
    center: MapPosition
}

const initialState: MapState = {
    isClickable: true,
    // Lille
    center: MapPosition.fromLatLng({
        lat: 50.633333,
        lng: 3.066667
    })
};

/**
 * Reducers
 *
 * @param  {MapState = initialState} state
 * @param  {MapActions.All}          action
 * @return {MapState}
 */
export function mapReducer(
    state: MapState = initialState,
    action: MapActions.All
): MapState {
    switch (action.type) {
        case MapActions.SET_CLICKABLE: {
            return {
                ...state,
                isClickable: action.payload
            };
        }

        case MapActions.SET_CENTER: {
            return {
                ...state,
                center: action.payload
            };
        }

        default:
            return state;
    }
}