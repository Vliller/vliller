import { Injectable } from '@angular/core';

@Injectable()
export class FavoritesService<T> {
    private favorites: T;

    constructor() {}
}