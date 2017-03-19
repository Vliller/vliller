import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'page-contribs',
    templateUrl: 'contribs.html'
})

export class Contribs {
    public contributors: Observable<any>;
    public contributorsLoaded: boolean = false;
    public appVersion: string;

    constructor(
        private http: Http,
        private viewCtrl: ViewController
    ) {
        this.contributors = this.getContributorsFromGithub();
        this.contributors.subscribe(() => this.contributorsLoaded = true);
    }

    private getContributorsFromGithub(): Observable<any> {
        return this.http
            .get('https://api.github.com/repos/alexetmanon/vliller/contributors')
            .map(response => response.json());
    }

    public close() {
        this.viewCtrl.dismiss();
    }

    public openLink(link) {
        new InAppBrowser().create(link, '_system');
    }
}