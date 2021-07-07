import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { startWith, switchMap, withLatestFrom, map, mergeMap, catchError } from 'rxjs/operators';

import { FavoritesActions } from '../actions/favorites';
import { VlilleStation } from '../models/vlille-station';
import { FavoritesService } from '../services/favorites-service';

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
        // station already in favorites
        if (VlilleStation.contains(collection, element)) {
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
}
