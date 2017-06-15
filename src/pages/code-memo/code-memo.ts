import { Component, AfterViewInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import * as Raven from 'raven-js';

import { CameraPreview } from '@ionic-native/camera-preview';

@Component({
    selector: 'page-code-memo',
    templateUrl: 'code-memo.html'
})

export class CodeMemo implements AfterViewInit {
    code: string;
    isPreviewRunning: boolean = false;

    ocradBoud: any;
    ocradImageSrc: string;

    constructor(
        private viewCtrl: ViewController,
        private cameraPreview: CameraPreview
    ) {
        // STUMB
        this.code = "____";
    }

    ngAfterViewInit() {

    }

    startPreview() {
        let bound = document.getElementsByClassName('lock-code')[0].getBoundingClientRect();

        this.isPreviewRunning = true
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
        );
    }

    runOCR() {
        let bound = document.getElementsByClassName('lock-code')[0].getBoundingClientRect();

        this.cameraPreview.takePicture({
            // width: bound.width,
            // height: bound.height
        }).then(base64PictureData => {
            this.stopPreview();
            this.code = "load";

            return this.prepareImage(base64PictureData);
        }).then(croppedBase64PictureData => {
            console.log(croppedBase64PictureData)

            this.ocradImageSrc = croppedBase64PictureData;

            (<any>window).OCRAD(document.getElementById('ocrad-image'), {
                // numeric: true
            }, text => {
                this.code = text.substring(0, 4);
            }, error => {
                this.code = "error"
                console.log(error);
            });
        });
    }

    private prepareImage(base64) {
        let image = new Image();
        image.src = 'data:image/jpeg;base64,' + base64;

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        let bound = document.getElementsByClassName('lock-code')[0].getBoundingClientRect();

        return new Promise((resolve, reject) => {
            image.onload = function() {
                ctx.drawImage(
                    image,
                    0, 0,
                    image.width, image.height,
                    0, 0,
                    bound.width, bound.height
                );

                resolve(canvas.toDataURL("image/jpeg", 0.5));
            };
        });
    }

    close() {
        this.viewCtrl.dismiss();
    }
}