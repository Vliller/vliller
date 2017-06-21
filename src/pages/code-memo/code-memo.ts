import { Component } from '@angular/core';
import { ViewController, Platform, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Raven from 'raven-js';

const PLACEHOLDER = "____";
const CODE_MAX_SIZE = 4;
const STORAGE_ID = 'lock-code';

@Component({
    selector: 'page-code-memo',
    templateUrl: 'code-memo.html'
})

export class CodeMemo {
    code: string = "";
    placeholder: string = PLACEHOLDER;
    isCodeEdition: boolean = false;

    constructor(
        private viewCtrl: ViewController,
        private platform: Platform,
        private toastController: ToastController
    ) {
        // loads data from storage
        platform.ready().then(() => this.loadCode());
    }

    private loadCode(): Promise<any> {
        return new NativeStorage().getItem(STORAGE_ID).then(code => {
            this.code = code;
            this.updatePlaceholder();
        });
    }

    private saveCode(): Promise<any> {
        return new NativeStorage().setItem(STORAGE_ID, this.code);
    }

    resetCode() {
        this.isCodeEdition = true;
        this.code = "";
        this.placeholder = PLACEHOLDER;
    }

    validCode() {
        this.saveCode()
        .then(() => {
            this.isCodeEdition = false;
            this.close();
        })
        .catch(error => {
            Raven.captureException(new Error(error));

            this.toastController.create({
                message: "Impossible d'enregistrer le code !",
                showCloseButton: true,
                closeButtonText: 'OK'
            }).present();
        });
    }

    insertNumber(number: string) {
        if (this.code.length >= CODE_MAX_SIZE) {
            return;
        }

        this.code += number;
        this.updatePlaceholder();
    }

    removeNumber() {
        if (this.code.length <= 0) {
            return;
        }

        this.code = this.code.slice(0, -1);
        this.updatePlaceholder();
    }

    private updatePlaceholder() {
        if (this.code.length === 0) {
            this.placeholder = PLACEHOLDER;
        } else {
            this.placeholder = PLACEHOLDER.slice(0, -this.code.length);
        }
    }

    close() {
        this.viewCtrl.dismiss();
    }
}