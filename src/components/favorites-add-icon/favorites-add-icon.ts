import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { VlilleStation } from '../../services/vlille/vlille';
import { FavoritesService } from '../../services/favorites/favorites';
import { ToastService } from '../../services/toast/toast';

@Component({
    selector: 'favorites-add-icon',
    templateUrl: './favorites-add-icon.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FavoritesAddIcon implements OnChanges {
    public isFavoriteStation: boolean = false;

    @Input() station: VlilleStation;

    constructor(
        private favoritesService: FavoritesService,
        private toastService: ToastService
    ) {}

    ngOnChanges() {
        this.isFavoriteStation = this.favoritesService.contains(this.station);
    }

    /**
     * Updates favorites service and star icon
     */
    public toggleFavorite() {
        this.isFavoriteStation = !this.isFavoriteStation;

        if (this.isFavoriteStation) {
            this.isFavoriteStation = this.favoritesService.add(this.station);

            if (this.isFavoriteStation) {
                this.showAddToast();
            } else {
                this.showErrorToast();
            }

        } else {
            this.isFavoriteStation = !this.favoritesService.remove(this.station);

            this.showRemoveToast();
        }
    }

    private showAddToast() {
        this.toastService.show('Station <b>' + this.station.name + '</b> ajoutée !', {
            duration: 3000
        });
    }

    private showRemoveToast() {
        this.toastService.show('Station <b>' + this.station.name + '</b> retirée.',  {
            duration: 3000
        });
    }

    private showErrorToast() {
        this.toastService.showError('Vous avez atteint le nombre maximum de favoris&nbsp;!',  {
            duration: 3000
        });
    }
}