import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import * as Raven from 'raven-js';

import { CameraPreview } from '@ionic-native/camera-preview';

@Component({
    selector: 'page-code-memo',
    templateUrl: 'code-memo.html'
})

export class CodeMemo {
    code: string;
    isPreviewRunning: boolean = false;

    constructor(
        private viewCtrl: ViewController,
        private cameraPreview: CameraPreview
    ) {
        // STUMB
        this.code = "0342";
    }

    startPreview() {
        this.isPreviewRunning = true

        let bound = document.getElementsByClassName('lock-code')[0].getBoundingClientRect();

        this.cameraPreview.startCamera({
            x: bound.left,
            y: bound.top,
            height: bound.height,
            width: bound.width,
            camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
            tapPhoto: false,
            // tapFocus: true
        }).then(
            null,
            error => {
                this.isPreviewRunning = false;

                Raven.captureException(new Error(error));
            }
        );
    }

    stopPreview() {
        this.cameraPreview.stopCamera().then(
            () => this.isPreviewRunning = false,
            error => Raven.captureException(new Error(error))
        );;
    }

    runOCR() {
        // TODO

        this.stopPreview();
    }

    close() {
        this.viewCtrl.dismiss();
    }
}