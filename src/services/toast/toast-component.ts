import { Component } from '@angular/core';
import { ToastService, Toast } from './toast';

@Component({
    selector: 'toast-component',
    template: `
        <div class="toast-component" [hidden]="!showToast">
            <ion-spinner [hidden]="!showSpinner" color="light" ></ion-spinner>
            <span [innerHTML]="message"></span>
        </div>
    `
})

export class ToastComponent {
    public showToast: boolean = false;
    public showSpinner: boolean = false;
    public message: string;

    constructor(private toastService: ToastService) {
        this.toastService.asObservable().subscribe(toast => {
            if (toast) {
                this.show(toast);
            } else {
                this.hide();
            }
        });
    }

    private show(toast: Toast) {
        this.message = toast.message;
        this.showSpinner = toast.options.showSpinner || false;

        this.showToast = true;
    }

    private hide() {
        this.showToast = false;
        this.showSpinner = false;
    }
}