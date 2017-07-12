import { StationsActions } from '../actions/stations';
import { VlilleStation } from '../models/vlillestation';

/**
 *
 */
export interface StationsState {
    active: VlilleStation,
    collection: VlilleStation[]
}

const initialState: StationsState = {
    active: undefined,
    collection: []
};

/**
 * Reducers
 *
 * @param  {StationsState = initialState} state
 * @param  {StationsActions.All}          action
 * @return {StationsState}
 */
export function stationsReducer(state: StationsState = initialState, action: StationsActions.All): StationsState {
    switch (action.type) {
        case StationsActions.LOAD_SUCCESS: {
            return {
                ...state,

                // loads stations
                collection: action.payload
            }
        }

        case StationsActions.SET_ACTIVE:
        case StationsActions.UPDATE_ACTIVE_SUCCESS: {
            return {
                ...state,

                // updates active station
                active: action.payload,
                collection: state.collection.map(station => {
                    let freshStation = action.payload;

                    return freshStation.id === station.id ? freshStation : station;
                })
            }
        }

        default:
            return state;
    }
}