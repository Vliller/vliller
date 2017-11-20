import { StationsActions } from '../actions/stations';
import { VlilleStation } from '../models/vlille-station';
import { rawStations } from '../data/vlille-stations-raw';

/**
 *
 */
export interface StationsState {
    active: VlilleStation,
    isActiveLoading: boolean,
    collection: VlilleStation[]
}

const initialState: StationsState = {
    active: undefined,
    isActiveLoading: false,
    collection: rawStations.records.map(VlilleStation.rawDataToVlilleStation)
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

        case StationsActions.SET_ACTIVE: {
            return {
                ...state,

                // set active station
                active: action.payload
            }
        }

        case StationsActions.UPDATE_ACTIVE: {
            return {
                ...state,

                // loading mode during station fetching
                isActiveLoading: true
            };
        }

        case StationsActions.UPDATE_ACTIVE_SUCCESS: {
            return {
                ...state,

                // updates active station in stations collection
                active: action.payload,
                isActiveLoading: false,
                collection: state.collection.map(station => {
                    let freshStation = action.payload;

                    return freshStation.id === station.id ? freshStation : station;
                })
            };
        }

        case StationsActions.UPDATE_ACTIVE_FAIL: {
            return {
                ...state,

                // stop loaing mode
                isActiveLoading: false
            };
        }

        default:
            return state;
    }
}