import { MapActions } from '../actions/map';

/**
 *
 */
export interface MapState {
    isClickable: boolean
}

const initialState: MapState = {
    isClickable: true
};

/**
 * Reducers
 *
 * @param  {MapState = initialState} state
 * @param  {MapActions.All}          action
 * @return {MapState}
 */
export function mapReducer(state: MapState = initialState, action: MapActions.All): MapState {
    switch (action.type) {
        case MapActions.SET_CLICKABLE: {
            return {
                isClickable: action.payload
            };
        }

        default:
            return state;
    }
}