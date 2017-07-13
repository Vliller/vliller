import { MapActions } from '../actions/map';

/**
 *
 */
export interface MapState {
    isClickable: boolean,
    isExpanded: boolean
}

const initialState: MapState = {
    isClickable: true,
    isExpanded: false
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
                ...state,
                isClickable: action.payload
            };
        }

        case MapActions.SET_EXPANDED: {
            return {
                ...state,
                isExpanded: action.payload
            };
        }

        default:
            return state;
    }
}