import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { startWith, switchMap, withLatestFrom, map, mergeMap, catchError } from 'rxjs/operators';

import { FavoritesActions } from '../actions/favorites';
import { FavoritesService } from '../services/favorites';
import { VlilleStation } from '../models/vlille-station';

const FAVORITES_MAX_SIZE = 4;

@Injectable()
export class FavoritesEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private favoritesService: FavoritesService,
  ) {}

  /**
   * Load the favorite from the FavoritesService
   */
  @Effect() loadFavorites$: Observable<Action> = this.actions$
    .ofType(FavoritesActions.LOAD)
    .pipe(
      startWith(new FavoritesActions.Load()),
      switchMap(() =>
        this.favoritesService
        .load()
        .pipe(
          map((stations: VlilleStation[]) => new FavoritesActions.LoadSuccess(stations)),
          catchError(error => Observable.of(new FavoritesActions.LoadFail(error)))
        )
      )
    );

  /**
   * Adds a favorite through the FavoritesService
   */
  @Effect() addFavorites$: Observable<Action> = this.actions$
    .ofType(FavoritesActions.ADD)
    .pipe(
      // get store value
      withLatestFrom(this.store$),
      map(([action, state]: [FavoritesActions.Add, AppState]) => [action.payload, state.favorites.collection]),
      mergeMap(([element, collection]: [VlilleStation, VlilleStation[]]) => {
        // max size reached
        if (collection.length >= FAVORITES_MAX_SIZE) {
          return Observable.of(new FavoritesActions.AddFailMaxSize());
        }

        // station already in favorites
        if (this.contains(collection, element)) {
          return Observable.empty();
        }

        // adds station to local storage
        return this.favoritesService
          .save([...collection, element])
          .pipe(
            map(() => new FavoritesActions.AddSuccess(element)),
            catchError(error => Observable.of(new FavoritesActions.AddFail(error)))
          );
      })
    );

  /**
   * Removes a favorite through the FavoritesService
   */
  @Effect() removeFavorites$: Observable<Action> = this.actions$
    .ofType(FavoritesActions.REMOVE)
    .pipe(
      // get store value
      withLatestFrom(this.store$),
      map(([action, state]: [FavoritesActions.Remove, AppState]) => [action.payload, state.favorites.collection]),
      mergeMap(([element, collection]: [VlilleStation, VlilleStation[]]) => {
        // nothing to remove
        if (collection.length === 0) {
          return Observable.empty();
        }

        // removes station from local storage
        return this.favoritesService
          .save(collection.filter(favorite => favorite.id !== element.id))
          .pipe(
            map(() => new FavoritesActions.RemoveSuccess(element)),
            catchError(error => Observable.of(new FavoritesActions.RemoveFail(error)))
          );
      })
    );

  /**
   * Simple contains function base on element id
   * @param  {VlilleStation[]} collection
   * @param  {VlilleStation}   element
   * @return {boolean}
   */
  private contains(collection: VlilleStation[], element: VlilleStation): boolean {
    if (!element) {
      return false;
    }

    // compare elements id
    for (let currentElement of collection) {
      if (currentElement.id === element.id) {
        return true;
      }
    }

    return false;
  }
}