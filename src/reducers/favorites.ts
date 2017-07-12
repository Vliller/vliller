import { FavoritesActions } from '../actions/favorites';
import { VlilleStation } from '../models/vlillestation';

/**
 *
 */
export interface FavoritesState {
    collection: VlilleStation[]
}

const initialState: FavoritesState = {
    collection: []
};

/**
 * Reducers
 *
 * @param  {FavoritesState = initialState} state
 * @param  {FavoritesActions.All}          action
 * @return {FavoritesState}
 */
export function favoritesReducer(state: FavoritesState = initialState, action: FavoritesActions.All): FavoritesState {
    switch (action.type) {
        case FavoritesActions.LOAD_SUCCESS: {
            return {
                ...state,

                // loads stations to the favorites
                collection: action.payload
            }
        }

        case FavoritesActions.ADD_SUCCESS: {
            // check if station is already in the favorites
            if (state.collection.filter(station => station.id === action.payload.id).length) {
                return state;
            }

            return {
                ...state,

                // adds station to the favorites
                collection: state.collection.concat(action.payload)
            }
        }

        case FavoritesActions.ADD_SUCCESS: {
            // check if station is already in the favorites
            if (state.collection.filter(station => station.id === action.payload.id).length) {
                return state;
            }

            return {
                ...state,

                // adds station to the favorites
                collection: state.collection.concat(action.payload)
            };
        }


        case FavoritesActions.REMOVE_SUCCESS: {
            return {
                ...state,

                // remove station from the favorites
                collection: state.collection.filter(station => station.id !== action.payload.id)
            };
        }

        default:
            return state;
    }
}