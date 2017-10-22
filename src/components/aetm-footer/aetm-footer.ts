import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'aetm-footer',
    templateUrl: 'aetm-footer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AetmFooter {
    constructor (private inAppBrowserPlugin: InAppBrowser) {}

    public openLink(link) {
        this.inAppBrowserPlugin.create(link, '_system');
    }
}