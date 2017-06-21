import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
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
        private platform: Platform
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
        // TODO handle errors
        this.saveCode();
        this.isCodeEdition = false;
        // this.close();
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