import { Component, AfterViewInit } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
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
        private cameraPreview: CameraPreview,
        private platform: Platform
    ) {
        // STUMB
        this.code = "____";
    }

    ngAfterViewInit() {

    }

    startPreview() {
        let bounds = document.getElementsByClassName('lock-code')[0].getBoundingClientRect();

        this.isPreviewRunning = true
        this.cameraPreview.startCamera({
            x: bounds.left,
            y: bounds.top,
            height: bounds.height,
            width: bounds.width,
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
        let bounds = document.getElementsByClassName('lock-code')[0].getBoundingClientRect();

        this.cameraPreview.takePicture({
            width: this.platform.width(),
            height: this.platform.height(),
            quality: 50
        }).then(base64PictureData => {
            this.stopPreview();
            this.code = "load";

            return this.prepareImage(base64PictureData);
        }).then(croppedBase64PictureData => {
            console.log(croppedBase64PictureData)

            this.ocradImageSrc = croppedBase64PictureData

            let imageElement = new Image(bounds.height, bounds.width);
            imageElement.src = croppedBase64PictureData;

            imageElement.onload = () => {
                (<any>window).OCRAD(imageElement, {
                    // numeric: true
                }, text => {
                    this.code = text.substring(0, 4);
                });
            };
        });
    }

    private prepareImage(base64) {
        let image = new Image();
        image.src = 'data:image/jpeg;base64,' + base64;

        let bounds = document.getElementsByClassName('lock-code')[0].getBoundingClientRect();

        console.log(bounds)

        let canvas = document.createElement('canvas');
        canvas.height = bounds.height;
        canvas.width = bounds.width;

        let ctx = canvas.getContext('2d');

        return new Promise((resolve, reject) => {
            image.onload = () => {
                console.log('Source image:');
                console.log('w: ' + image.width);
                console.log('h: ' + image.height);

                let c = image.height / this.platform.height();

                let offsetTop = bounds.top * c;
                let offsetLeft = bounds.left * c;
                let sourceHeight = bounds.height * c;

                console.log('Computed:');
                console.log('w: ' + image.width);
                console.log('h: ' + sourceHeight);
                console.log('top: ' + offsetTop);
                console.log('left: ' + offsetLeft)

                ctx.drawImage(
                    image,
                    0, offsetTop,
                    image.width, sourceHeight,
                    0, 0,
                    bounds.width, bounds.height
                );

                resolve(canvas.toDataURL("image/jpeg", 0.5));
            };
        });
    }

    close() {
        this.stopPreview();
        this.viewCtrl.dismiss();
    }
}