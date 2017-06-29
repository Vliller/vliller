import { FavoritesState, favoritesReducer } from '../reducers/favorites';
import { ToastState, toastReducer } from '../reducers/toast';

/**
 * App state
 */
export interface AppState {
    favorites: FavoritesState,
    toast: ToastState
}

/**
 * App reducers
 */
export const reducers = {
    favorites: favoritesReducer,
    toast: toastReducer
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