import { MapActions } from '../actions/map';
import { MapPosition } from '../models/map-position';
import { AppSettings } from '../app/app.settings';

/**
 *
 */
export interface MapState {
    isClickable: boolean
    center: MapPosition
}

const initialState: MapState = {
    isClickable: true,
    center: MapPosition.fromLatLng(AppSettings.defaultPosition)
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