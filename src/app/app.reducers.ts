import { FavoritesState, favoritesReducer } from '../reducers/favorites';
import { ToastState, toastReducer } from '../reducers/toast';
import { StationsState, stationsReducer } from '../reducers/stations';
import { LocationState, locationReducer } from '../reducers/location';

/**
 * App state
 */
export interface AppState {
    favorites: FavoritesState,
    toast: ToastState,
    stations: StationsState,
    location: LocationState
}

/**
 * App reducers
 */
export const reducers = {
    favorites: favoritesReducer,
    toast: toastReducer,
    stations: stationsReducer,
    location: locationReducer
}

/**
 * Selector helpers
 */
export function selectFavorites(state: AppState) {
    return state.favorites.collection;
}

export function selectToast(state: AppState) {
    return state.toast.toast;
}

export function selectStations(state: AppState) {
    return state.stations.collection;
}

export function selectActiveStation(state: AppState) {
    return state.stations.active;
}

export function selectCurrentPosition(state: AppState) {
    return state.location.position;
}