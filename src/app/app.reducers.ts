import { ActionReducerMap } from '@ngrx/store';
import { FavoritesState, favoritesReducer } from '../reducers/favorites';
import { ToastState, toastReducer } from '../reducers/toast';
import { StationsState, stationsReducer } from '../reducers/stations';
import { LocationState, locationReducer } from '../reducers/location';
import { MapState, mapReducer } from '../reducers/map';

/**
 * App state
 */
export interface AppState {
    favorites: FavoritesState,
    toast: ToastState,
    stations: StationsState,
    location: LocationState,
    map: MapState
}

/**
 * App reducers
 */
export const reducers: ActionReducerMap<AppState> = {
    favorites: favoritesReducer,
    toast: toastReducer,
    stations: stationsReducer,
    location: locationReducer,
    map: mapReducer
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

export function selectIsLoadingActiveStation(state: AppState) {
    return state.stations.isActiveLoading;
}

export function selectCurrentPosition(state: AppState) {
    return state.location.position;
}

export function selectCurrentPositionIsLoading(state: AppState) {
    return state.location.isLoading;
}

export function selectMapIsClickable(state: AppState) {
    return state.map.isClickable;
}